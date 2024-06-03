import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('serverPort');
  await app.listen(port);
  logger.log('Server started on port ' + port);
}
bootstrap();
