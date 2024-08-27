import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post()
    async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto){
        return this.subscriptionService.createSubscription(createSubscriptionDto);
    }

    @Get(':id')
    async getSubscription(@Param('id') id: string){
        return this.subscriptionService.getSubscription(id);
    }

    @Get()
    async getAllSubscriptions(){
        return this.subscriptionService.getAllSubscriptions();
    }

    @MessagePattern('get_subscription')
    async getSubscriptionMicroservice(id: string){
        return this.subscriptionService.getSubscription(id);
    }

}
