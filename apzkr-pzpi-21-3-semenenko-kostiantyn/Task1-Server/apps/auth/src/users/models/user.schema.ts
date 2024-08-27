import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    name: string;

    @Prop()
    bio: string;

    @Prop()
    dob: Date;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'SubscriptionDocument', required: true })
    subscriptionId: Types.ObjectId;

    @Prop()
    city: string;

    @Prop()
    country: string;

    @Prop({
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true },
    })
    location: {
        type: string;
        coordinates: [number, number];
    };

}

export const UserSchema =
    SchemaFactory.createForClass(UserDocument);

    UserSchema.index({ location: '2dsphere' });

    UserSchema.virtual('dogs', {
        ref: 'DogDocument',
        localField: '_id',
        foreignField: 'ownerId', 
    });
    
    UserSchema.set('toObject', { virtuals: true });
    UserSchema.set('toJSON', { virtuals: true });
