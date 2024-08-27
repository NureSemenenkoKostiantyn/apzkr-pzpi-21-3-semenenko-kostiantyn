import { Inject, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { MatchesRepository } from './matches.repository';
import { AUTH_SERVICE, DOGS_SERVICE, UserDto } from '@app/common';
import { PreferencesService } from './preferences/preferences.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import { PreferenceDocument } from './models/preferences.schema';
import { DogDocument } from 'apps/dogs/src/models/dogs.schema';
import { Types } from 'mongoose';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);
  constructor(
    private readonly matchesRepository: MatchesRepository,
    private readonly preferencesService: PreferencesService,
    @Inject(DOGS_SERVICE) private readonly dogsClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy
  ) { }

  async findPotentialMatches(user: UserDto) {
    let userPreferences;
    try {
      userPreferences = await this.preferencesService.getPreferences(user._id);
    } catch (error) {
      throw new NotFoundException('User preferences not found');
    }
    const userDogs = await lastValueFrom(this.dogsClient.send('dogs_by_user', user).pipe(
      map((response) => response)
    ));

    const nearbyUsers = await lastValueFrom(this.authClient.send<UserDto[]>('get_nearby_users', user).pipe(
      map((response) => response)
    ));

    if (nearbyUsers.length === 0) {
      return [];
    }

    const matchedUserIds = await this.getMatchedUserIds(user._id);

    let filteredUsers = nearbyUsers.filter((nearbyUser) => {
      return !matchedUserIds.includes(nearbyUser._id.toString());
    })

    filteredUsers = filteredUsers.filter((nearbyUser) => {
      return nearbyUser.dogs.some((dog) =>
        this.doesDogMatchPreferences(userPreferences, dog, 2)
      )
    })

    const potentialMatches = await Promise.all(filteredUsers.map(async (matchingUser) => {
      return await this.matchesRepository.create({
        userId1: Types.ObjectId.createFromHexString(user._id),
        userId2: Types.ObjectId.createFromHexString(matchingUser._id),
        status: 'pending'
    })
    }));



    return potentialMatches;
  }

  async acceptMatch(user: UserDto, matchId: string) {
    return this.matchesRepository.findOneAndUpdate({ _id: matchId }, { status: 'matched', matchedAt: new Date() });
  }

  async rejectMatch(user: UserDto, matchId: string) {
    return this.matchesRepository.findOneAndUpdate({ _id: matchId }, { status: 'rejected', rejectedAt: new Date() });
  }

  async getMatchHistory({ _id: userId }: UserDto) {
    return this.matchesRepository.find({ $or: [{ userId1: userId }, { userId2: userId }] });
  }


  private async getMatchedUserIds(userId: string) {
    const matchedPairs = await this.matchesRepository.find({ $or: [{ userId1: userId }, { userId2: userId }] });

    const matchedUserIds = matchedPairs.map(pair => (
      pair.userId1.toString() === userId ? pair.userId2.toString() : pair.userId1.toString()
    ));

    return matchedUserIds;
  }

  private doesDogMatchPreferences(preferences: PreferenceDocument, dog: DogDocument, minPreferencesMatched: number): boolean {
    let matchCount = 0;

    if (preferences.preferredDogBreeds.includes(dog.breed)) matchCount++;
    if (preferences.preferredDogSizes.includes(dog.size)) matchCount++;
    if (preferences.preferredEnergyLevel === dog?.personality?.energyLevel) matchCount++;
    if (preferences.preferredFriendliness === dog?.personality?.friendliness) matchCount++;
    if (preferences.preferredPlayfulness === dog?.personality?.playfulness) matchCount++;
    return matchCount >= minPreferencesMatched;
  }



}
