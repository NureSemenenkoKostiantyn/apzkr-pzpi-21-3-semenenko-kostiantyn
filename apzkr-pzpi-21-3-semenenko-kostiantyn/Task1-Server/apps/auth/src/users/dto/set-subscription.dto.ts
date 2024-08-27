import { CardDto } from "@app/common";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";

export class SetSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    subscriptionId: string;

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CardDto)
    card: CardDto;
}