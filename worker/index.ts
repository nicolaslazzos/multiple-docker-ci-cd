import { createClient } from 'redis';

const bootstrap = async () => {
  const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });

  await redisClient.connect();

  const redisPublisher = redisClient.duplicate();

  await redisPublisher.connect();

  const fib = (index: number): number => {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
  };

  redisPublisher.subscribe('insert', (message) => {
    redisClient.hSet('values', message, fib(parseInt(message)));
  });
};

bootstrap();
