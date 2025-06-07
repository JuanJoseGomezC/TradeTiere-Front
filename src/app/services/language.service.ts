import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface LanguageDto {
  id?: number;
  language: string;
}

export interface UpdateLanguageDto {
  language?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private endpoint = '/language';

  constructor(private apiService: ApiService) { }

  /**
   * Get all languages
   */
  getAll(): Observable<LanguageDto[]> {
    return this.apiService.get<LanguageDto[]>(this.endpoint);
  }

  /**
   * Get a language by ID
   */
  getById(id: number): Observable<LanguageDto> {
    return this.apiService.get<LanguageDto>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new language
   */
  createLanguage(language: LanguageDto): Observable<LanguageDto> {
    return this.apiService.post<LanguageDto>(this.endpoint, language);
  }

  /**
   * Update a language
   */
  updateLanguage(id: number, language: UpdateLanguageDto): Observable<UpdateLanguageDto> {
    return this.apiService.put<UpdateLanguageDto>(`${this.endpoint}/${id}`, language);
  }

  /**
   * Delete a language
   */
  deleteLanguage(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}
