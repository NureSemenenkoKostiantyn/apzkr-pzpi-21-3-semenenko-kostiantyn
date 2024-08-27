import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ versionKey: false })
export class PreferenceDocument extends AbstractDocument {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'UserDocument', required: true })
    userId: Types.ObjectId;

    @Prop({ type: [String], enum: ['small', 'medium', 'large'], required: false })
    preferredDogSizes: string[];

    @Prop({ type: [String], required: false })
    preferredDogBreeds: string[];

    @Prop({ type: String, enum: ['low', 'medium', 'high'], required: false })
    preferredEnergyLevel: string;

    @Prop({ type: String, enum: ['shy', 'friendly', 'aggressive'], required: false })
    preferredFriendliness: string;

    @Prop({ type: String, enum: ['not playful', 'somewhat playful', 'very playful'], required: false })
    preferredPlayfulness: string;
    
    @Prop({ type: Boolean, required: false })
    prefersSameGenderDogs: boolean;

    @Prop({ type: Boolean, required: false })
    prefersNearbyMatches: boolean;
}

export const PreferenceSchema = 
    SchemaFactory.createForClass(PreferenceDocument);