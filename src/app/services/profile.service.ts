import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError, tap, map } from 'rxjs/operators';
import { User } from './auth.service';
import { ApiService } from './api.service';

export interface UserProfile extends User {
  address?: string;
  province?: string;
  about?: string;
  website?: string;
  notifications?: {
    mail: boolean;
    newMessages: boolean;
    newFavorites: boolean;
    promotions: boolean;
  };
}

export interface UpdateProfileDto {
  name?: string;
  lastname?: string;
  birthday?: string;
  phone?: string;
  profileImage?: string;
  address?: string;
  province?: string;
  about?: string;
  website?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private apiService: ApiService) { }
  getProfile(userId: number): Observable<UserProfile> {
    return this.apiService.get<UserProfile>(`/user/${userId}`);
  }
  updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    if (!profileData.id) {
      return throwError(() => new Error('Usuario no especificado'));
    }

    return this.apiService.put<UserProfile>(`/user/updateProfile`, profileData);
  }
  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<boolean> {
    return this.apiService.post<any>(`/user/${userId}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      map(() => true),
      catchError(err => {
        return throwError(() => new Error('Error al cambiar la contraseña'));
      })
    );
  }
  updateNotificationSettings(userId: number, settings: any): Observable<boolean> {
    return this.apiService.put<any>(`/user/${userId}/notifications`, settings).pipe(
      map(() => true),
      catchError(err => {
        return throwError(() => new Error('Error al actualizar las notificaciones'));
      })
    );
  }
  deleteAccount(userId: number): Observable<boolean> {
    return this.apiService.delete<any>(`/user/${userId}`).pipe(
      map(() => true),
      catchError(err => {
        return throwError(() => new Error('Error al eliminar la cuenta'));
      })
    );
  }
  /**
   * Get user's messages
   */
  getUserMessages(userId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`/user/${userId}/messages`);
  }
}
