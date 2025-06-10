import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

export interface SpecieDto {
  id?: number;
  name: string;
  language: number;
}

export interface UpdateSpecieDto {
  name?: string;
  language?: number;
}

// Allowed category keys
export type CategoryKey = 'vacuno' | 'ovino' | 'caprino' | 'porcino' | 'avicola' | 'equino' | 'otros';

// Mapping of species IDs to frontend category keys
export const SPECIES_CATEGORIES: Record<number, CategoryKey> = {
  1: 'vacuno',
  2: 'ovino',
  3: 'caprino',
  4: 'porcino',
  5: 'avicola',
  6: 'equino',
  7: 'otros'
};

@Injectable({
  providedIn: 'root'
})
export class SpecieService {
  private endpoint = '/specie';

  constructor(private apiService: ApiService) { }

  /**
   * Get all species
   */
  getAll(): Observable<SpecieDto[]> {
    return this.apiService.get<SpecieDto[]>(this.endpoint);
  }

  /**
   * Get a specie by ID
   */
  getById(id: number): Observable<SpecieDto> {
    return this.apiService.get<SpecieDto>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new specie
   */
  createSpecie(specie: SpecieDto): Observable<SpecieDto> {
    return this.apiService.post<SpecieDto>(this.endpoint, specie);
  }

  /**
   * Update a specie
   */
  updateSpecie(id: number, specie: UpdateSpecieDto): Observable<UpdateSpecieDto> {
    return this.apiService.put<UpdateSpecieDto>(`${this.endpoint}/${id}`, specie);
  }

  /**
   * Delete a specie
   */
  deleteSpecie(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Get all species with enhanced frontend properties
   */
  getAllEnhanced(): Observable<SpecieDto[]> {
    return this.apiService.get<SpecieDto[]>(this.endpoint).pipe(
      map(species => species.map(specie => this.enhanceSpecie(specie)))
    );
  }

  /**
   * Enhances a species DTO with frontend-specific properties
   */
  private enhanceSpecie(specieDto: SpecieDto): SpecieDto {
    const categoryKey = specieDto.id ? SPECIES_CATEGORIES[specieDto.id] : undefined;

    return specieDto;
  }

  /**
   * Returns a display-friendly name for species
   */
  private getDisplayName(name: string): string {
    // Capitalize first letter and format the name
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  /**
   * Returns an appropriate icon for each category
   */
  private getCategoryIcon(categoryKey?: string): string {
    const iconMap: Record<CategoryKey, string> = {
      'vacuno': 'assets/images/icons/cow.svg',
      'ovino': 'assets/images/icons/sheep.svg',
      'caprino': 'assets/images/icons/goat.svg',
      'porcino': 'assets/images/icons/pig.svg',
      'avicola': 'assets/images/icons/chicken.svg',
      'equino': 'assets/images/icons/horse.svg',
      'otros': 'assets/images/icons/paw.svg'
    };

    return categoryKey && (categoryKey as CategoryKey) in iconMap
      ? iconMap[categoryKey as CategoryKey]
      : iconMap['otros'];
  }
}
