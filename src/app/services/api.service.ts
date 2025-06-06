import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  /**
   * Sets the authorization header with the JWT token
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Generic GET method
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    const options = {
      headers: this.getHeaders(),
      params: params
    };
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  /**
   * Generic POST method
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  /**
   * Generic PUT method
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  /**
   * Generic DELETE method
   */
  delete<T>(endpoint: string): Observable<T> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options);
  }
}
