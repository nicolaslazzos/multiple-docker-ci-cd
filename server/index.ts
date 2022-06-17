import express from 'express';
import { OptionsJson } from 'body-parser';
import cors from 'cors';
import { Pool, PoolConfig } from 'pg';
import { createClient } from 'redis';

const bootstrap = async () => {
  const app = express();

  // middleware
  app.use(cors());
  app.use(express.json({ extended: false } as OptionsJson));

  // postgres
  const pgClient = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PORT
  } as PoolConfig);

  pgClient.on("connect", (client) => client.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch(console.log));

  // redis
  const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });

  await redisClient.connect();

  const redisPublisher = redisClient.duplicate();

  await redisPublisher.connect();

  // routes
  app.get('/', (req, res) => {
    try {
      res.send('Ok');
    } catch (e) {
      res.status(500).send('Internal server error');
    }
  });

  app.get('/values/all', async (req, res) => {
    try {
      const values = await pgClient.query("SELECT * from values");

      res.send(values.rows);
    } catch (e) {
      console.log(e);

      res.status(500).send('Internal server error');
    }
  });

  app.get("/values/current", async (req, res) => {
    try {
      const values = await redisClient.hGetAll("values");

      res.send(values);
    } catch (e) {
      console.log(e);

      res.status(500).send('Internal server error');
    }
  });

  app.post("/values", async (req, res) => {
    try {
      const index = req.body.index;

      if (parseInt(index) > 40) {
        return res.status(422).send("Index too high");
      }

      redisClient.hSet("values", index, "Nothing yet!");

      redisPublisher.publish("insert", index);

      pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

      res.send({ working: true });
    } catch (e) {
      console.log(e);

      res.status(500).send('Internal server error');
    }
  });

  const PORT = 5000;

  app.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });
};

bootstrap();
