import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { DogDocument } from "./models/dogs.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class DogsRepository extends AbstractRepository<DogDocument> {
    protected readonly logger = new Logger(DogsRepository.name);

    constructor(@InjectModel(DogDocument.name) reservationModel: Model<DogDocument>) {
        super(reservationModel);
    }
}