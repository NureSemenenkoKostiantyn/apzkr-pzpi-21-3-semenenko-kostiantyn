import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class MatchDocument extends AbstractDocument {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'UserDocument', required: true })
    userId1: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'UserDocument', required: true })
    userId2: Types.ObjectId;

    @Prop({ type: String, enum: ['pending', 'matched', 'rejected'], default: 'pending' })
    status: string;

    @Prop({ type: Date, required: false })
    matchedAt?: Date;

    @Prop({ type: Date, required: false })
    rejectedAt?: Date;
}

export const MatchSchema = 
    SchemaFactory.createForClass(MatchDocument);