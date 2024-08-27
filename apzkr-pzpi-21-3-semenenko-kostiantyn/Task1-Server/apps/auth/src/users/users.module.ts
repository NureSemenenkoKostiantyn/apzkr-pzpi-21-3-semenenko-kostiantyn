import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, LoggerModule, PAYMENTS_SERVICE } from '@app/common';
import { UserDocument, UserSchema } from './models/user.schema';
import { UsersRepository } from './users.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { SubscriptionModule } from '../subscription/subscription.module';
import { DogDocument, DogSchema } from 'apps/dogs/src/models/dogs.schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: DogDocument.name, schema: DogSchema }
    ]),
    ClientsModule.registerAsync([
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    LoggerModule,
    SubscriptionModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
