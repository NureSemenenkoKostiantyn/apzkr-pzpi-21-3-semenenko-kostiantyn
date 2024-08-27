import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class DogDocument extends AbstractDocument {
    @Prop({ required: true })
    name: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'UserDocument', required: true })
    ownerId: Types.ObjectId;

    @Prop({ required: true })
    breed: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true, enum: ['male', 'female'] })
    gender: string;

    @Prop({ required: true, enum: ['small', 'medium', 'large'] })
    size: string;

    @Prop({
        type: {
            energyLevel: { type: String, enum: ['low', 'medium', 'high'] },
            friendliness: { type: String, enum: ['shy', 'friendly', 'aggressive'] },
            playfulness: { type: String, enum: ['not playful', 'somewhat playful', 'very playful'] },
            preferences: {
                likesWater: { type: Boolean, default: false },
                likesToys: [String],
                favoriteActivities: [String],
            },
        },
        _id: false,
        required: false
    })
    personality: {
        energyLevel: string;
        friendliness: string;
        playfulness: string;
        preferences: {
            likesWater: boolean;
            likesToys: string[];
            favoriteActivities: string[];
        };
    };

    @Prop({
        type: {
            weight: Number,
            vaccinations: [
                {
                    name: { type: String, required: true },
                    date: { type: Date, required: true },
                    nextDueDate: { type: Date, required: true },
                },
            ],
            medicalConditions: [String],
            medications: [
                {
                    name: { type: String, required: true },
                    dosage: { type: String, required: true },
                    frequency: { type: String, required: true },
                },
            ],
        },
        _id: false,
        required: false
    })
    health: {
        weight: number;
        vaccinations: {
            name: string;
            date: Date;
            nextDueDate: Date;
        }[];
        medicalConditions: string[];
        medications: {
            name: string;
            dosage: string;
            frequency: string;
        }[];
    };

    @Prop({required: false})
    profileImageUrl?: string;
}

export const DogSchema =
    SchemaFactory.createForClass(DogDocument);
