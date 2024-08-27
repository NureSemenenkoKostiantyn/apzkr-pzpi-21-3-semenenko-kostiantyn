import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class PreferencesDto {
    @IsBoolean()
    likesWater: boolean;

    @IsArray()
    @IsString({ each: true })
    likesToys: string[];

    @IsArray()
    @IsString({ each: true })
    favoriteActivities: string[];
}

class PersonalityDto {
    @IsString()
    @IsEnum(['low', 'medium', 'high'])
    energyLevel: string;

    @IsString()
    @IsEnum(['shy', 'friendly', 'aggressive'])
    friendliness: string;

    @IsString()
    @IsEnum(['not playful', 'somewhat playful', 'very playful'])
    playfulness: string;

    @ValidateNested()
    @Type(() => PreferencesDto)
    preferences: PreferencesDto;
}



class HealthDto {
    @IsNumber()
    weight: number;

    @ValidateNested({ each: true })
    @Type(() => VaccinationDto)
    vaccinations: VaccinationDto[];

    @IsArray()
    @IsString({ each: true })
    medicalConditions: string[];

    @ValidateNested({ each: true })
    @Type(() => MedicationDto)
    medications: MedicationDto[];
}

class VaccinationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsDate()
    @IsNotEmpty()
    nextDueDate: Date;
}

class MedicationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    dosage: string;

    @IsString()
    @IsNotEmpty()
    frequency: string;
}


export class CreateDogDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    breed: string;

    @IsNumber()
    @IsNotEmpty()
    age: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['male', 'female'])
    gender: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['small', 'medium', 'large'])
    size: string;

    @ValidateNested()
    @Type(() => PersonalityDto)
    personality: PersonalityDto;

    @ValidateNested()
    @Type(() => HealthDto)
    health: HealthDto;

    @IsString()
    @IsOptional()
    profileImageUrl?: string;
}

