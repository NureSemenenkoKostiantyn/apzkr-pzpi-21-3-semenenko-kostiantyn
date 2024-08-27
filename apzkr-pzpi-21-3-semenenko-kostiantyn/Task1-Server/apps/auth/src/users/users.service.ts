import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Types } from 'mongoose';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { SetSubscriptionDto } from './dto/set-subscription.dto';
import { map } from 'rxjs';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository, 
        private subscriptionService: SubscriptionService,
        @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
    ) {}
    async createUser(createUserDto: CreateUserDto) {
        await this.validateCreateUserDto(createUserDto);
        return this.usersRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
            subscriptionId: Types.ObjectId.createFromHexString(createUserDto.subscriptionId)
        });
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.usersRepository.findOne({email: createUserDto.email});
        } catch (error) {
            return;
        }
        throw new UnprocessableEntityException("Email already exists");
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw new UnauthorizedException("Credentials are invalid");
        }
        return user;
    }

    async getUser(getUserDto: GetUserDto) {
        return this.usersRepository.findOne(getUserDto, 'subscriptionId');
    }

    async setSubscription({ email, _id: userId }: UserDto, setSubscriptionDto: SetSubscriptionDto) {

        const subscription = await this.subscriptionService.getSubscription(setSubscriptionDto.subscriptionId );

        if (!subscription) {
            throw new UnprocessableEntityException("Subscription not found");
        }

        return this.paymentsService
            .send('create_charge', {
                card: setSubscriptionDto.card,
                amount: subscription.price,
                email
            })
            .pipe(
                map((res) => {
                    return this.usersRepository
                        .findOneAndUpdate({ _id: userId }, { subscriptionId: setSubscriptionDto.subscriptionId });
                })
            );
    }

    async findNearbyUsers(user: UserDto, maxDistance: number = 50) {
        return this.usersRepository.find({
            location: {
              $geoWithin: {
                $centerSphere: [
                  [user.location.coordinates[0], user.location.coordinates[1]], 
                  maxDistance / 6378.1 
                ]
              }
            },
            _id: { $ne: user._id } 
          }, 'dogs');
    }


}
