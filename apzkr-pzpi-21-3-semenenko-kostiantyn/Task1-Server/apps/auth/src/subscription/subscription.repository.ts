import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { SubscriptionDocument } from "./models/subscription.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class SubscriptionRepository extends AbstractRepository<SubscriptionDocument> {
    protected readonly logger = new Logger(SubscriptionRepository.name);

    constructor(@InjectModel(SubscriptionDocument.name) subscriptionModel: Model<SubscriptionDocument>) {
        super(subscriptionModel);
    }
}