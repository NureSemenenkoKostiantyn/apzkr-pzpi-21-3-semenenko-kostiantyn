import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService {
    constructor(private subscriptionRepository: SubscriptionRepository) {}

    async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
        return this.subscriptionRepository.create({
            ...createSubscriptionDto,
        });
    }

    async getSubscription(id: string) {
        return this.subscriptionRepository.findOne({ _id: id });
    }

    async getAllSubscriptions() {
        return this.subscriptionRepository.find({});
    }
}
