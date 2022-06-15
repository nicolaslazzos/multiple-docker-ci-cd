import { createClient } from 'redis';

const redisClient = createClient({
  // @ts-ignore
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

const fib = (index: number): number => {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
};

redisPublisher.subscribe('insert', (message) => {
  redisClient.hSet('values', message, fib(parseInt(message)));
});
