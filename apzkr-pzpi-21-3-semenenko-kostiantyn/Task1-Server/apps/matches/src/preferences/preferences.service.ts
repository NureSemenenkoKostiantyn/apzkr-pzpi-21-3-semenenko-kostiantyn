import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PreferenceDocument } from "../models/preferences.schema";
import { Model } from "mongoose";
import { UpdatePreferencesDto } from "../dto/update-preferences.dto";
import { PreferencesRepository } from "./preferences.repository";
import { UserDto } from "@app/common";

@Injectable()
export class PreferencesService {
    constructor(
        private readonly preferencesRepository: PreferencesRepository
    ) { }

    async updatePreferences({ _id: userId }: UserDto, updatePreferencesDto: UpdatePreferencesDto): Promise<any> {
        return this.preferencesRepository.findOneAndUpsert({ userId }, updatePreferencesDto);
    }

    async getPreferences(userId: string): Promise<PreferenceDocument> {
        return this.preferencesRepository.findOne({ userId });
    }

}