import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PinoModule } from './pino/pino.module';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { ServiceModule } from './service/service.module';
import { PrismaModule } from './prisma/prisma.module';
import serviceConfig from './config/serviceConfig';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [serviceConfig] }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/v1/graphql',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    PinoModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ApiModule,
    ServiceModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
