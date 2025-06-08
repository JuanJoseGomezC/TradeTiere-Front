import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ApiService } from './api.service';
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
  location: number;
  specie: number;
  race: number;
  language: number;
  birthdate: Date;
  gender: string;
  state: boolean;
  create_at: Date;
  image?: ImageDto | null;
}

export interface Advertisment extends AdvertismentDto {
  // Additional frontend properties
  category?: 'vacuno' | 'ovino' | 'caprino' | 'porcino' | 'avicola' | 'equino' | 'otros';
  breed?: string;
  age?: number;
  province?: string;
  images?: string[];
  sellerId?: number;
  sellerName?: string;
  sellerRating?: number;
  sellerJoinDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  views?: number;
  favorite?: boolean;
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
  specie: number | string;
  race: number | string;
  language: number | string;
  birthdate: string | Date;
  gender: string;
  imageBase64: string | null;
  imageName: string | null;
  imageType: string | null;
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
   * Get all advertisments
   */ getAdvertisments(category?: string): Observable<Advertisment[]> {
    return this.apiService.get<AdvertismentDto[]>('/advertisment').pipe(
      map((ads) => {
        // Convert API DTOs to frontend model with additional properties
        const enhancedAds = ads.map((ad) => this.enhanceAdvertisment(ad));

        if (category) {
          // Filter by category if provided
          return enhancedAds.filter((ad) => ad.category === category);
        }
        return enhancedAds;
      })
    );
  }

  /**
   * Get advertisment by ID
   */ getAdvertismentById(id: number): Observable<Advertisment | undefined> {
    return this.apiService
      .get<AdvertismentDto>(`/advertisment/${id}`)
      .pipe(map((ad) => this.enhanceAdvertisment(ad)));
  }

  /**
   * Create a new advertisment
   */ createAdvertisment(data: FormValue): Observable<Advertisment> {
    // Map to the expected format
    const dto = this.mapFormToDto(data);
    return this.apiService
      .post<AdvertismentDto>('/advertisment', dto)
      .pipe(map((ad) => this.enhanceAdvertisment(ad)));
  }

  private mapFormToDto(data: FormValue): AdvertismentDto {
    return {
      title: data.title,
      description: data.description,
      price: data.price,
      location: Number(data.location),
      specie: Number(data.specie),
      race: Number(data.race),
      language: Number(data.language),
      birthdate: new Date(data.birthdate),
      gender: data.gender,
      state: true,
      create_at: new Date(),
      image: data.imageBase64
        ? {
            imageBase64: data.imageBase64,
            name: data.imageName || '',
            contentType: data.imageType || '',
          }
        : undefined,
    };
  }

  /**
   * Update an existing advertisment
   */ updateAdvertisment(
    id: number,
    adData: Partial<Advertisment>
  ): Observable<Advertisment> {
    // Map to the expected format
    const updateDto: UpdateAdvertismentDto = this.mapToApiFormat(adData);
    return this.apiService
      .put<AdvertismentDto>(`/advertisment/${id}`, updateDto)
      .pipe(map((ad) => this.enhanceAdvertisment(ad)));
  }

  /**
   * Delete an advertisment
   */ deleteAdvertisment(id: number): Observable<any> {
    return this.apiService.delete(`/advertisment/${id}`);
  }
  /**
   * Get user's advertisments
   */ getUserAdvertisments(email: string): Observable<Advertisment[]> {
    return this.apiService
      .get<AdvertismentDto[]>(`/advertisment/email/${email}`)
      .pipe(map((ads) => ads.map((ad) => this.enhanceAdvertisment(ad))));
  }

  /**
   * Update advertisment status (sold/active)
   */ updateAdStatus(
    adId: number,
    status: boolean
  ): Observable<Advertisment | null> {
    const updateData: UpdateAdvertismentDto = {
      // In the API, status is represented by the 'state' field
      // true = active, false = sold
    };

    return this.apiService
      .put<AdvertismentDto>(`/advertisment/${adId}`, { state: status })
      .pipe(map((ad) => this.enhanceAdvertisment(ad)));
  }

  /**
   * Get advertisments by category (species)
   */
  getAdvertismentsByCategory(specieId: number): Observable<Advertisment[]> {
    return this.apiService
      .get<AdvertismentDto[]>(`/advertisment/bySpecie/${specieId}`)
      .pipe(map((ads) => ads.map((ad) => this.enhanceAdvertisment(ad))));
  }

  /**
   * Helper method to map frontend model to API format
   */
  private mapToApiFormat(adData: Partial<Advertisment>): any {
    return {
      title: adData.title,
      description: adData.description,
      location: adData.location,
      specie: adData.specie,
      race: adData.race,
      birthdate: adData.birthdate,
      language: adData.language,
      gender: adData.gender,
      price: adData.price,
      state: adData.state !== undefined ? adData.state : true, // Default active
    };
  }

  /**
   * Helper method to map specie ID to category
   */
  private mapSpecieToCategory(
    specieId: number
  ):
    | 'vacuno'
    | 'ovino'
    | 'caprino'
    | 'porcino'
    | 'avicola'
    | 'equino'
    | 'otros'
    | undefined {
    // This mapping will need to be updated based on your actual data
    const specieMap: Record<
      number,
      | 'vacuno'
      | 'ovino'
      | 'caprino'
      | 'porcino'
      | 'avicola'
      | 'equino'
      | 'otros'
    > = {
      1: 'vacuno',
      2: 'ovino',
      3: 'caprino',
      4: 'porcino',
      5: 'avicola',
      6: 'equino',
      7: 'otros',
    };

    return specieMap[specieId];
  }

  /**
   * Enhances an advertisment DTO with frontend-specific properties
   */
  private enhanceAdvertisment(adDto: AdvertismentDto): Advertisment {
    // Calculate age based on birthdate
    const birthDate = adDto.birthdate ? new Date(adDto.birthdate) : undefined;
    const age = birthDate ? this.calculateAge(birthDate) : undefined;

    // Transform API model to frontend model
    return {
      ...adDto,
      category: this.mapSpecieToCategory(adDto.specie),
      age: age,
      // Add more frontend properties here as needed
      favorite: false, // Default value, would be set by user preferences
      // We'd get these from related endpoints in a real app
      province: 'Desconocida', // would come from location service
      breed: 'Desconocida', // would come from race service
      images: [], // would come from files/images service
    };
  }

  /**
   * Calculate age in years from birthdate
   */
  private calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
