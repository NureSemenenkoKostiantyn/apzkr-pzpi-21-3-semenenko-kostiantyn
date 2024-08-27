import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../current-user.decorator';
import { UserDocument } from './models/user.schema';
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SetSubscriptionDto } from './dto/set-subscription.dto';
import { UserDto } from '@app/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(
        @CurrentUser() user: UserDocument
    ) {
        return user;
    }

    @Post('set_subscription/')
    @UseGuards(JwtAuthGuard)
    async setSubscription(
        @Body() setSubscriptionDto: SetSubscriptionDto,
        @CurrentUser() user: UserDto
    ) {
        return this.usersService.setSubscription(user, setSubscriptionDto);
    }

    @MessagePattern('get_nearby_users')
    async getNearbyUser(@Payload() user: UserDto) {
        return this.usersService.findNearbyUsers(user);
    }
}
