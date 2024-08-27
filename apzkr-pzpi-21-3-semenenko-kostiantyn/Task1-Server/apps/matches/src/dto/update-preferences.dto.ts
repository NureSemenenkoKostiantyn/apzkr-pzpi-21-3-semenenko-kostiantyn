import { IsBoolean, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredDogSizes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredDogBreeds?: string[];

  @IsOptional()
  @IsString()
  preferredEnergyLevel?: string;

  @IsOptional()
  @IsString()
  preferredFriendliness?: string;

  @IsOptional()
  @IsString()
  preferredPlayfulness?: string;

  @IsOptional()
  @IsBoolean()
  prefersSameGenderDogs?: boolean;

  @IsOptional()
  @IsBoolean()
  prefersNearbyMatches?: boolean;
}
