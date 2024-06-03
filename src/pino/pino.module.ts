import { LoggerModule } from 'nestjs-pino';
import * as os from 'os';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * A dynamic module that provides a Pino logger.
 */
const PinoModule = LoggerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const logLevel = configService.get<string>('logLevel', 'info');
    const serviceName = configService.get<string>('serviceName');
    const transportOptions = {
      targets: [
        {
          target: 'pino-pretty',
          level: 'warn',
          options: {
            ignore: 'hostname,pid',
          },
        },
      ],
    };
    return {
      pinoHttp: {
        level: logLevel,
        base: {
          host: os.hostname(),
          service: serviceName,
        },
        transport: transportOptions,
      },
    };
  },
});

export { PinoModule };
