import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

export interface User {
  id: number;
  name: string;
  lastname: string;
  mail: string;
  birthday?: Date;
  createAt?: Date;
  phone?: string;
  profileImage?: string;
  joinDate?: Date;
}

export interface LoginResponse {
  user: User;
  token: string;
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1'; // Real backend API URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem('current_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  /**
   * Gets current user information from storage
   */
  getCurrentUser(): User | null {
    return this.currentUserValue;
  }
  
  /**
   * Refreshes user information from the API
   */
  refreshUserData(): Observable<User> {
    const currentUser = this.currentUserValue;
    
    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }
    
    return this.apiService.get<User>(`/users/${currentUser.id}`).pipe(
      tap(user => {
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => new Error('Error al obtener datos del usuario.'));
      })
    );
  }
  login(email: string, password: string): Observable<User> {
    // Use the ApiService to call the backend login endpoint
    return this.apiService.post<LoginResponse>('/auth/login', { mail: email, password }).pipe(
      map(response => {
        // Store user details and token in local storage
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem('current_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        return response.user;
      }),
      catchError(error => {
        return throwError(() => new Error('Error durante el inicio de sesión. Inténtelo de nuevo.'));
      })
    );
  }
  register(registerData: RegisterDto): Observable<User> {
    // Use the ApiService to call the backend register endpoint
    return this.apiService.post<LoginResponse>('/auth/register', registerData).pipe(
      map(response => {
        // Store user details and token in local storage
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem('current_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        return response.user;
      }),
      catchError(error => {
        return throwError(() => new Error('Error durante el registro. Inténtelo de nuevo.'));
      })
    );
  }

  logout() {
    // Remove user from local storage and set current user to null
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  updateProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this.currentUserValue;

    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // Use the apiService to update the user profile
    return this.apiService.put<User>(`/users/${currentUser.id}`, userData).pipe(
      tap(updatedUser => {
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(error => {
        return throwError(() => new Error('Error al actualizar el perfil. Inténtelo de nuevo.'));
      })
    );
  }
}
