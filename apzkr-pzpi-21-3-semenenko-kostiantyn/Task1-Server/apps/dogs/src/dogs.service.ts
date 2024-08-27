import { DogsRepository } from './dogs.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { Types } from 'mongoose';

@Injectable()
export class DogsService {
  constructor(
    private readonly dogsRepository: DogsRepository
  ) { }

  async create(createDogDto: CreateDogDto, userId: string) {
    return this.dogsRepository.create({
      ...createDogDto,
      ownerId: Types.ObjectId.createFromHexString(userId)
    });
  }

  async findOne(_id: string) {
    return this.dogsRepository.findOne({ _id });
  }

  async findByUser(userId: string) {
    const ownerId = Types.ObjectId.createFromHexString(userId);
    return this.dogsRepository.find({ownerId});
  }

  async update(_id: string, updateDogDto: UpdateDogDto, userId: string) {

    const dog = await this.dogsRepository.findOne({ _id });

    if (dog.ownerId.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this dog');
    }

    return this.dogsRepository.findOneAndUpdate(
      { _id }, 
      { $set: updateDogDto }
    );
  }

  async remove(_id: string, userId: string) {
    const dog = await this.dogsRepository.findOne({ _id });

    if (dog.ownerId.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this dog');
    }

    return this.dogsRepository.findOneAndDelete({ _id });
  }
}
