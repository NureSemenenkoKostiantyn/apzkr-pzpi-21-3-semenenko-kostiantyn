import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({versionKey: false})
export class SubscriptionDocument extends AbstractDocument {
    
    @Prop()
    name: string;

    @Prop()
    price: number;
}

export const SubscriptionSchema = 
    SchemaFactory.createForClass(SubscriptionDocument);
