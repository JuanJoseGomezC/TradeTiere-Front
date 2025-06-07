import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ApiService } from './api.service';

export interface AdvertisementDto {
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
}

export interface Advertisement extends AdvertisementDto {
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

export interface UpdateAdvertisementDto {
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
  providedIn: 'root'
})
export class AdvertisementService {

  constructor(private apiService: ApiService) { }
  /**
   * Get all advertisements
   */  getAdvertisements(category?: string): Observable<Advertisement[]> {
    return this.apiService.get<AdvertisementDto[]>('/advertisement')
      .pipe(
        map(ads => {
          // Convert API DTOs to frontend model with additional properties
          const enhancedAds = ads.map(ad => this.enhanceAdvertisement(ad));

          if (category) {
            // Filter by category if provided
            return enhancedAds.filter(ad => ad.category === category);
          }
          return enhancedAds;
        })
      );
  }

  /**
   * Get advertisement by ID
   */  getAdvertisementById(id: number): Observable<Advertisement | undefined> {
    return this.apiService.get<AdvertisementDto>(`/advertisement/${id}`)
      .pipe(
        map(ad => this.enhanceAdvertisement(ad))
      );
  }

  /**
   * Create a new advertisement
   */  createAdvertisement(adData: Partial<Advertisement>): Observable<Advertisement> {
    // Map to the expected format
    const advertisementDto = this.mapToApiFormat(adData);
    return this.apiService.post<AdvertisementDto>('/advertisement', advertisementDto)
      .pipe(
        map(ad => this.enhanceAdvertisement(ad))
      );
  }/**
   * Update an existing advertisement
   */  updateAdvertisement(id: number, adData: Partial<Advertisement>): Observable<Advertisement> {
    // Map to the expected format
    const updateDto: UpdateAdvertisementDto = this.mapToApiFormat(adData);
    return this.apiService.put<AdvertisementDto>(`/advertisement/${id}`, updateDto)
      .pipe(
        map(ad => this.enhanceAdvertisement(ad))
      );
  }

  /**
   * Delete an advertisement
   */  deleteAdvertisement(id: number): Observable<any> {
    return this.apiService.delete(`/advertisement/${id}`);
  }
  /**
   * Get user's advertisements
   */  getUserAdvertisements(email: string): Observable<Advertisement[]> {
    return this.apiService.get<AdvertisementDto[]>(`/advertisement/${email}`)
      .pipe(
        map(ads => ads.map(ad => this.enhanceAdvertisement(ad)))
      );
  }

  /**
   * Update advertisement status (sold/active)
   */  updateAdStatus(adId: number, status: boolean): Observable<Advertisement | null> {
    const updateData: UpdateAdvertisementDto = {
      // In the API, status is represented by the 'state' field
      // true = active, false = sold
    };

    return this.apiService.put<AdvertisementDto>(`/advertisement/${adId}`, { state: status })
      .pipe(
        map(ad => this.enhanceAdvertisement(ad))
      );
  }

  /**
   * Get advertisements by category (species)
   */
  getAdvertisementsByCategory(specieId: number): Observable<Advertisement[]> {
    return this.apiService.get<AdvertisementDto[]>(`/advertisement/bySpecie/${specieId}`)
      .pipe(
        map(ads => ads.map(ad => this.enhanceAdvertisement(ad)))
      );
  }

  /**
   * Helper method to map frontend model to API format
   */
  private mapToApiFormat(adData: Partial<Advertisement>): any {
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
      state: adData.state !== undefined ? adData.state : true // Default active
    };
  }
  /**
   * Helper method to map specie ID to category
   */
  private mapSpecieToCategory(specieId: number): 'vacuno' | 'ovino' | 'caprino' | 'porcino' | 'avicola' | 'equino' | 'otros' | undefined {
    // This mapping will need to be updated based on your actual data
    const specieMap: Record<number, 'vacuno' | 'ovino' | 'caprino' | 'porcino' | 'avicola' | 'equino' | 'otros'> = {
      1: 'vacuno',
      2: 'ovino',
      3: 'caprino',
      4: 'porcino',
      5: 'avicola',
      6: 'equino',
      7: 'otros'
    };

    return specieMap[specieId];
  }

  /**
   * Enhances an advertisement DTO with frontend-specific properties
   */
  private enhanceAdvertisement(adDto: AdvertisementDto): Advertisement {
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
      images: [] // would come from files/images service
    };
  }

  /**
   * Calculate age in years from birthdate
   */
  private calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }
}
