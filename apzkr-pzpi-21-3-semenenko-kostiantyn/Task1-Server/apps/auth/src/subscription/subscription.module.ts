import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { SubscriptionDocument, SubscriptionSchema } from './models/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';


@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([
          { name: SubscriptionDocument.name, schema: SubscriptionSchema }
        ]),
        LoggerModule
      ],
      controllers: [SubscriptionController],
      providers: [SubscriptionService, SubscriptionRepository],
      exports: [SubscriptionService]
})
export class SubscriptionModule {}
