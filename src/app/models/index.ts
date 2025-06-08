export * from './advertisment.model';

// API DTOs based on Swagger definition

export interface UserDto {
  id?: number;
  birthday?: string;
  mail: string;
  name: string;
  lastname: string;
  createAt?: string;
  password?: string;
}

export interface UpdateUserDto {
  birthday?: string;
  name?: string;
  lastname?: string;
  password?: string;
}

export interface SpecieDto {
  id?: number;
  name: string;
  language: number;
}

export interface UpdateSpecieDto {
  name?: string;
  language?: number;
}

export interface RaceDto {
  id?: number;
  name: string;
  specie: number;
  language: number;
}

export interface UpdateRaceDto {
  name?: string;
  specie?: number;
  language?: number;
}

export interface LocationDto {
  id?: number;
  name: string;
  language: number;
}

export interface UpdateLocationDto {
  name?: string;
  language?: number;
}

export interface LanguageDto {
  id?: number;
  language: string;
}

export interface UpdateLanguageDto {
  language?: string;
}

export interface AdvertismentDto {
  id?: number;
  title: string;
  description: string;
  location: number;
  language: number;
  birthdate: string;
  gender: string;
  price: number;
  race: number;
  specie: number;
  state: boolean;
  create_at: string;
}

export interface UpdateAdvertismentDto {
  title?: string;
  description?: string;
  location?: number;
  specie?: number;
  race?: number;
  birthdate?: string;
  language?: number;
  gender?: string;
  price?: number;
}

export interface LoginDto {
  mail: string;
  password: string;
}

export interface RegisterDto {
  mail: string;
  name: string;
  lastname: string;
  birthdate: string;
  password: string;
}

export interface TokenDto {
  token: string;
}

export interface PurchaseHistoryIdDto {
  buyerId: number;
  advertismentId: number;
}

export interface PurchaseHistoryDto {
  buyer: number;
  date: string;
  advertisment: number;
}
