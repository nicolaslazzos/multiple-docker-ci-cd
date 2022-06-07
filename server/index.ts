import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { createClient } from 'redis';

const app = express();

// middleware
app.use(cors());
app.use(express.json({ extended: false } as any));

// postgres
const pgClient = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  // @ts-ignore
  port: process.env.PORT
});

pgClient.on("connect", (client) => {
  client.query("CREATE TABLE IF NOT EXISTS values (number INT").catch(console.log);
});

// redis
const redisClient = createClient({
  // @ts-ignore
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// routes
app.get('/', (req, res) => {
  res.send('Ok');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values);
});

app.get("/values/current", async (req, res) => {
  const values = await redisClient.hGetAll("values");

  res.send(values);
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hSet("values", index, "Nothing yet!");

  redisPublisher.publish("insert", index);

  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

const PORT = 5000;

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });