import { FilterQuery, Model, Types, UpdateQuery, QueryOptions } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;

    constructor(protected readonly model: Model<TDocument>) {}

    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId()
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument;
    }

    async findOne(
        filterQuery: FilterQuery<TDocument>,
        populate?: string | string[]
    ): Promise<TDocument> {
        let query = this.model.findOne(filterQuery).lean<TDocument>(true);

        if (populate) {
            query = query.populate(populate);
        }

        const document = await query.exec();

        if (!document) {
            this.logger.warn(`Document was not found with filterQuery: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException('Document was not found');
        }

        return document;
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>, 
        update: UpdateQuery<TDocument>,
        populate?: string | string[]
    ): Promise<TDocument> {
        let query = this.model.findOneAndUpdate(filterQuery, update, { new: true }).lean<TDocument>(true);

        if (populate) {
            query = query.populate(populate);
        }

        const document = await query.exec();

        if (!document) {
            this.logger.warn(`Document was not found with filterQuery: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException('Document was not found');
        }

        return document;
    }

    async findOneAndUpsert(
        filterQuery: FilterQuery<TDocument>, 
        update: UpdateQuery<TDocument>,
        populate?: string | string[]
    ): Promise<TDocument> {
        let query = this.model.findOneAndUpdate(filterQuery, update, { upsert: true, new: true }).lean<TDocument>(true);

        if (populate) {
            query = query.populate(populate);
        }

        const document = await query.exec();

        return document;
    }

    async find(
        filterQuery: FilterQuery<TDocument>,
        populate?: string | string[]
    ): Promise<TDocument[]> {
        let query = this.model.find(filterQuery).lean<TDocument[]>(true);

        if (populate) {
            query = query.populate(populate);
        }

        return query.exec();
    }

    async findPagination(
        filterQuery: FilterQuery<TDocument>, 
        options?: { limit?: number; skip?: number; sort?: Record<string, any> },
        populate?: string | string[]
    ): Promise<TDocument[]> {
        let query = this.model.find(filterQuery).lean<TDocument[]>(true);

        if (populate) {
            query = query.populate(populate);
        }

        if (options?.limit) {
            query.limit(options.limit);
        }
    
        if (options?.skip) {
            query.skip(options.skip);
        }
    
        if (options?.sort) {
            query.sort(options.sort);
        }
    
        return query.exec();
    }

    async findOneAndDelete(
        filterQuery: FilterQuery<TDocument>,
        populate?: string | string[]
    ): Promise<TDocument> { 
        let query = this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);

        if (populate) {
            query = query.populate(populate);
        }

        return query.exec();
    }
}
