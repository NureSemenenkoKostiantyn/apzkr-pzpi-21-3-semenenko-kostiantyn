import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

class LocationDto {

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsArray()
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    coordinates: [number, number];
}


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    bio: string;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    dob: Date;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    subscriptionId?: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @Type(() => LocationDto)
    location: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
}
