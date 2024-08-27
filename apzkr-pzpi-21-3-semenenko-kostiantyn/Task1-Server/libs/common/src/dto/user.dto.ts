import { DogDocument } from "apps/dogs/src/models/dogs.schema";

export interface UserDto {
    _id: string;

    email: string;

    password: string;

    name: string;

    bio: string;

    dob: Date;

    subscriptionId: string;

    city: string;

    country: string;

    location: {
        type: string;
        coordinates: [number, number];
    };

    dogs?: DogDocument[];
}