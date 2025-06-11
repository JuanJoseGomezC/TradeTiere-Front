import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ApiService } from './api.service';
import { SpecieDto } from './specie.service';
import { RaceDto } from './race.service';
import { LocationDto } from './location.service';

export interface ImageDto {
  imageBase64: string;
  name: string;
  contentType: string;
}

export interface AdvertismentDto {
  id?: number;
  title: string;
  description: string;
  price: number;
  location: LocationDto;
  specie: SpecieDto;
  race: RaceDto;
  language: number;
  birthdate: Date;
  gender: string;
  state: boolean;
  create_at: Date;
  image?: ImageDto | null;
  userId?: number; // Añadido para reflejar el nuevo DTO del backend
}

export interface CreateAdvertismentDto {
  title: string;
  description: string;
  price: number;
  location: LocationDto;
  specie: SpecieDto;
  race: RaceDto;
  language: number;
  birthdate: Date;
  gender: string;
  state: boolean;
  create_at: Date;
  image?: ImageDto | null;
}

export interface Advertisment extends AdvertismentDto {
  // La propiedad 'category' ha sido eliminada
  breed?: string;
  age?: number;
  province?: string;
  sellerId?: number;
  sellerName?: string;
  sellerRating?: number;
  sellerJoinDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  views?: number;
  favorite?: boolean;
  imageUrl?: string | null;
}

export interface RelatedAd {
  id?: number;
  title: string;
  price: number;
  images?: string[];
  province?: string;
}
export interface FormValue {
  title: string;
  description: string;
  price: number;
  location: number | string;
  specie: SpecieDto;
  race: RaceDto;
  language: number | string;
  birthdate: string | Date;
  gender: string;
  image: ImageDto;
}

export interface UpdateAdvertismentDto {
  title?: string;
  description?: string;
  location?: number;
  specie?: number;
  race?: number;
  birthdate?: Date;
  language?: number;
  gender?: string;
  price?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdvertismentService {
  constructor(private apiService: ApiService) {}

  /**
   * Obtener todos los anuncios. El parámetro 'specieName' se usa para filtrar por nombre de especie.
   */
  getAdvertisments(specieName?: string): Observable<Advertisment[]> {
    return this.apiService.get<AdvertismentDto[]>('/advertisment').pipe(
      map((ads) => {
        const enhancedAds = ads.map((ad) => this.enhanceAdvertisment(ad));

        if (specieName) {
          // Filtrar por el nombre de la especie en lugar de la categoría
          return enhancedAds.filter((ad) => ad.specie.name === specieName);
        }
        return enhancedAds;
      })
    );
  }

  /**
   * Obtener anuncio por ID
   */
  getAdvertismentById(id: number): Observable<Advertisment | undefined> {
    return this.apiService
      .get<AdvertismentDto>(`/advertisment/${id}`)
      .pipe(map((ad) => this.enhanceAdvertisment(ad)));
  }

  /**
   * Crear un nuevo anuncio
   */
  createAdvertisment(data: FormValue): Observable<Advertisment> {
    const dto = this.mapFormToCreateDto(data);
    return this.apiService
      .post<AdvertismentDto>('/advertisment', dto)
      .pipe(map((ad) => this.enhanceAdvertisment(ad)));
  }

  private mapFormToCreateDto(data: FormValue): CreateAdvertismentDto {
    // Buscar el objeto LocationDto completo según el id seleccionado
    let locationObj: LocationDto | undefined = undefined;
    if (typeof data.location === 'object' && data.location !== null && 'id' in data.location) {
      locationObj = data.location as LocationDto;
    }
    // Si solo se tiene el id, buscar en un array global o lanzar error (aquí solo fallback)
    if (!locationObj) {
      locationObj = { id: Number(data.location), name: '', language: 1 };
    }
    return {
      title: data.title,
      description: data.description,
      price: data.price,
      location: locationObj, // Enviar el objeto completo
      specie: data.specie,
      race: data.race,
      language: Number(data.language),
      birthdate: new Date(data.birthdate),
      gender: data.gender,
      state: true,
      create_at: new Date(),
      image:
        data.image.imageBase64 != null || data.image.imageBase64 != ''
          ? {
              imageBase64: data.image.imageBase64,
              name: data.image.contentType || '',
              contentType: data.image.contentType || '',
            }
          : undefined,
    };
  }

  /**
   * Actualizar un anuncio existente
   */
  updateAdvertisment(
    id: number,
    adData: Partial<Advertisment>
  ): Observable<Advertisment> {
    const updateDto: UpdateAdvertismentDto = this.mapToApiFormat(adData);
    return this.apiService
      .put<AdvertismentDto>(`/advertisment/${id}`, updateDto)
      .pipe(map((ad) => this.enhanceAdvertisment(ad)));
  }

  /**
   * Borrar un anuncio
   */
  deleteAdvertisment(id: number): Observable<any> {
    return this.apiService.delete(`/advertisment/${id}`);
  }
  /**
   * Obtener los anuncios de un usuario
   */
  getUserAdvertisments(email: string): Observable<Advertisment[]> {
    return this.apiService
      .get<AdvertismentDto[]>(`/advertisment/email/${email}`)
      .pipe(map((ads) => ads.map((ad) => this.enhanceAdvertisment(ad))));
  }

  /**
   * Actualizar el estado de un anuncio (vendido/activo)
   */
  updateAdStatus(
    adId: number,
    status: boolean
  ): Observable<Advertisment | null> {
    return this.apiService
      .put<AdvertismentDto>(`/advertisment/${adId}`, { state: status })
      .pipe(map((ad) => this.enhanceAdvertisment(ad)));
  }

  /**
   * Obtener anuncios por ID de especie
   */
  getAdvertismentsBySpecieId(specieId: number): Observable<Advertisment[]> {
    return this.apiService
      .get<AdvertismentDto[]>(`/advertisment/bySpecie/${specieId}`)
      .pipe(map((ads) => ads.map((ad) => this.enhanceAdvertisment(ad))));
  }

  /**
   * Helper para mapear el modelo del frontend al formato de la API para actualizar
   */
  private mapToApiFormat(adData: Partial<Advertisment>): UpdateAdvertismentDto {
    return {
      title: adData.title,
      description: adData.description,
      location: adData.location?.id,
      specie: adData.specie?.id,
      race: adData.race?.id,
      birthdate: adData.birthdate,
      language: adData.language,
      gender: adData.gender,
      price: adData.price,
    };
  }

  // La función mapSpecieToCategory ha sido eliminada por completo

  /**
   * Enriquece un DTO de anuncio con propiedades específicas del frontend
   */
  private enhanceAdvertisment(adDto: AdvertismentDto): Advertisment {
    const birthDate = adDto.birthdate ? new Date(adDto.birthdate) : undefined;
    const age = birthDate ? this.calculateAge(birthDate) : undefined;

    // Asegurar que create_at siempre es un Date válido
    let createAt: Date;
    if (adDto.create_at) {
      createAt =
        adDto.create_at instanceof Date
          ? adDto.create_at
          : new Date(adDto.create_at);
      if (isNaN(createAt.getTime())) {
        // Si la conversión falla, usar fecha actual como fallback
        createAt = new Date();
      }
    } else {
      createAt = new Date();
    }

    // Mapear userId a sellerId
    const sellerId = adDto.userId ?? undefined;

    return {
      ...adDto,
      age: age,
      favorite: false,
      province: 'Desconocida',
      breed: 'Desconocida',
      create_at: createAt,
      sellerId: sellerId,
      // sellerName: '', // Si tienes el nombre, asígnalo aquí
    };
  }

  /**
   * Calcula la edad en años completos a partir de la fecha de nacimiento
   */
  private calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  }
}
