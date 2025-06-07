import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

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

/**
 * Frontend model enriched with extra properties
 */
export interface Race extends RaceDto {
  displayName?: string;
  specieDisplayName?: string;
  breed?: string; // Alias for name, more intuitive in UI
  description?: string;
  categoryKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private endpoint = '/race';

  constructor(private apiService: ApiService) { }

  /**
   * Get all races
   */
  getAll(): Observable<RaceDto[]> {
    return this.apiService.get<RaceDto[]>(this.endpoint);
  }

  /**
   * Get a race by ID
   */
  getById(id: number): Observable<RaceDto> {
    return this.apiService.get<RaceDto>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new race
   */
  createRace(race: RaceDto): Observable<RaceDto> {
    return this.apiService.post<RaceDto>(this.endpoint, race);
  }

  /**
   * Update a race
   */
  updateRace(id: number, race: UpdateRaceDto): Observable<UpdateRaceDto> {
    return this.apiService.put<UpdateRaceDto>(`${this.endpoint}/${id}`, race);
  }

  /**
   * Delete a race
   */
  deleteRace(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Get all races with enhanced frontend properties
   */
  getAllEnhanced(): Observable<Race[]> {
    return this.apiService.get<RaceDto[]>(this.endpoint).pipe(
      map(races => races.map(race => this.enhanceRace(race)))
    );
  }

  /**
   * Get races filtered by specie
   */
  getRacesBySpecie(specieId: number): Observable<Race[]> {
    return this.apiService.get<RaceDto[]>(`${this.endpoint}/bySpecie/${specieId}`).pipe(
      map(races => races.map(race => this.enhanceRace(race)))
    );
  }

  /**
   * Enhances a race DTO with frontend-specific properties
   */
  private enhanceRace(raceDto: RaceDto): Race {
    // For now, just add some basic properties
    return {
      ...raceDto,
      displayName: this.getDisplayName(raceDto.name),
      breed: raceDto.name, // Alias for better semantics in UI
      description: `Raza ${raceDto.name} de excelente calidad`
    };
  }

  /**
   * Returns a display-friendly name for races
   */
  private getDisplayName(name: string): string {
    // Capitalize first letter and format the name
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
