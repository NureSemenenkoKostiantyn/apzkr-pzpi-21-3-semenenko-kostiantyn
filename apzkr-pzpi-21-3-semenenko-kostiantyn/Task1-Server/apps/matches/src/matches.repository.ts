import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MatchDocument } from "./models/matches.schema";

@Injectable()
export class MatchesRepository extends AbstractRepository<MatchDocument> {
    protected readonly logger = new Logger(MatchesRepository.name);

    constructor(@InjectModel(MatchDocument.name) matchesModel: Model<MatchDocument>) {
        super(matchesModel);
    }
}