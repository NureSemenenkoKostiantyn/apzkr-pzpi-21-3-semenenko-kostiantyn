import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PreferenceDocument } from "../models/preferences.schema";

@Injectable()
export class PreferencesRepository extends AbstractRepository<PreferenceDocument> {
    protected readonly logger = new Logger(PreferencesRepository.name);

    constructor(@InjectModel(PreferenceDocument.name) preferencesModel: Model<PreferenceDocument>) {
        super(preferencesModel);
    }
}