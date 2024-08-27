import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import * as Joi from 'joi';
import { AUTH_SERVICE, DatabaseModule, DOGS_SERVICE, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MatchDocument, MatchSchema } from './models/matches.schema';
import { PreferenceDocument, PreferenceSchema } from './models/preferences.schema';
import { PreferencesService } from './preferences/preferences.service';
import { MatchesRepository } from './matches.repository';
import { PreferencesRepository } from './preferences/preferences.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MatchDocument.name, schema: MatchSchema },
      { name: PreferenceDocument.name, schema: PreferenceSchema }
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        DOGS_HOST: Joi.string().required(),
        DOGS_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          }
        }),
        inject: [ConfigService]
      },
      {
        name: DOGS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('DOGS_HOST'),
            port: configService.get('DOGS_PORT'),
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [MatchesController],
  providers: [MatchesService, PreferencesService, MatchesRepository, PreferencesRepository],
})
export class MatchesModule {}
