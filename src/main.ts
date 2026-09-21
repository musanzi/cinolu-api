import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
import { Logger } from 'nestjs-pino';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.enableCors({
    credentials: true,
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  const redisClient = createClient({
    url: process.env.REDIS_URL
  });
  redisClient.on('error', (error) => {
    console.error('Redis client error', error);
  });
  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix: 'sess:'
      }),
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: {
        maxAge: +process.env.SESSION_MAX_AGE,
        sameSite: 'lax'
      }
    })
  );

  app.use(passport.initialize({}));
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle('OneStop API')
    .setDescription('REST API for the OneStop platform')
    .setVersion('1.0.0')
    .addCookieAuth('connect.sid', { type: 'apiKey' }, 'session')
    .addTag('auth', 'Authentication and account management')
    .addTag('users', 'User management')
    .addTag('roles', 'User roles')
    .addTag('portfolios', 'Program portfolios')
    .addTag('programs', 'Programs')
    .addTag('activities', 'Program activities')
    .addTag('participations', 'Activity participations')
    .addTag('reviews', 'Activity reviews')
    .addTag('ventures', 'User ventures')
    .addTag('sectors', 'Venture sectors')
    .addTag('types', 'Activity types')
    .addTag('categories', 'Activity categories')
    .addTag('stats', 'Statistics dashboards')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      content: document
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
