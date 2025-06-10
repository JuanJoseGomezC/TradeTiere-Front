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

@Injectable({
  providedIn: 'root',
})
export class SpecieService {
  private endpoint = '/specie';

  constructor(private apiService: ApiService) {}

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
  updateSpecie(
    id: number,
    specie: UpdateSpecieDto
  ): Observable<UpdateSpecieDto> {
    return this.apiService.put<UpdateSpecieDto>(
      `${this.endpoint}/${id}`,
      specie
    );
  }

  /**
   * Delete a specie
   */
  deleteSpecie(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}
