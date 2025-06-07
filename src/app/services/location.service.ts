import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

export interface LocationDto {
  id?: number;
  name: string;
  language: number;
}

export interface UpdateLocationDto {
  name?: string;
  language?: number;
}

/**
 * Frontend model enriched with extra properties
 */
export interface Location extends LocationDto {
  displayName?: string;
  province?: string;
  region?: string;
  coordinates?: { lat: number, lng: number };
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private endpoint = '/location';

  constructor(private apiService: ApiService) { }

  /**
   * Get all locations
   */
  getAll(): Observable<LocationDto[]> {
    return this.apiService.get<LocationDto[]>(this.endpoint);
  }

  /**
   * Get a location by ID
   */
  getById(id: number): Observable<LocationDto> {
    return this.apiService.get<LocationDto>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new location
   */
  createLocation(location: LocationDto): Observable<LocationDto> {
    return this.apiService.post<LocationDto>(this.endpoint, location);
  }

  /**
   * Update a location
   */
  updateLocation(id: number, location: UpdateLocationDto): Observable<UpdateLocationDto> {
    return this.apiService.put<UpdateLocationDto>(`${this.endpoint}/${id}`, location);
  }

  /**
   * Delete a location
   */
  deleteLocation(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Get all locations with enhanced frontend properties
   */
  getAllEnhanced(): Observable<Location[]> {
    return this.apiService.get<LocationDto[]>(this.endpoint).pipe(
      map(locations => locations.map(location => this.enhanceLocation(location)))
    );
  }

  /**
   * Enhances a location DTO with frontend-specific properties
   */
  private enhanceLocation(locationDto: LocationDto): Location {
    // For now, just add some basic properties
    // In a real app, we might have mappings to actual coordinates or regions
    return {
      ...locationDto,
      displayName: this.getDisplayName(locationDto.name),
      // Set province same as name for now
      province: locationDto.name
    };
  }

  /**
   * Returns a display-friendly name for location
   */
  private getDisplayName(name: string): string {
    // Capitalize first letter and format the name
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
