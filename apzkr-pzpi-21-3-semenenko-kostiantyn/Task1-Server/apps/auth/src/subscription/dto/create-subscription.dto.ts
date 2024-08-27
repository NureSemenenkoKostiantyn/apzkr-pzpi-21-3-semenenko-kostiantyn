import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateSubscriptionDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
