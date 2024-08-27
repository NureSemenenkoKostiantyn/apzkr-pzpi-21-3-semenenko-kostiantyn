import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDogDto: CreateDogDto, @CurrentUser() user: UserDto) {
    return this.dogsService.create(createDogDto, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/currentUser')
  findCurrentUser(@CurrentUser() user: UserDto) {
    console.log(user);
    return this.dogsService.findByUser(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    console.log(userId);
    return this.dogsService.findByUser(userId);
  }

  @MessagePattern('dogs_by_user')
  async findByUserMessage(@Payload() user: UserDto) {

    return this.dogsService.findByUser(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dogsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDogDto: UpdateDogDto, @CurrentUser() user: UserDto) {
    return this.dogsService.update(id, updateDogDto, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return this.dogsService.remove(id, user._id);
  }
}
