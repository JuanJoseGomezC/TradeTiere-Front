import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

export interface UserDto {
  id?: number;
  birthday?: string; // ISO date-time string
  mail: string;
  name: string;
  lastname: string;
  createAt?: string; // ISO date-time string
  password?: string; // Only used for write operations, never returned
}

export interface UpdateUserDto {
  birthday?: string; // ISO date-time string
  name?: string;
  lastname?: string;
  password?: string;
}

/**
 * Enhanced frontend user model
 */
export interface EnhancedUser extends UserDto {
  fullName?: string;
  age?: number;
  formattedJoinDate?: string;
  profileImageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = '/user';

  constructor(private apiService: ApiService) { }

  /**
   * Get user by ID
   */
  getById(id: number): Observable<UserDto> {
    return this.apiService.get<UserDto>(`${this.endpoint}/${id}`);
  }

  /**
   * Get user by email
   */
  getByMail(mail: string): Observable<UserDto> {
    return this.apiService.get<UserDto>(`${this.endpoint}/getByMail/${mail}`);
  }

  /**
   * Get all users (admin functionality)
   */
  getAll(): Observable<UserDto[]> {
    return this.apiService.get<UserDto[]>(`${this.endpoint}/getAll`);
  }

  /**
   * Update current user's profile
   */
  updateCurrentUser(user: UpdateUserDto): Observable<UpdateUserDto> {
    return this.apiService.put<UpdateUserDto>(`${this.endpoint}/updateProfile`, user);
  }

  /**
   * Delete user by email
   */
  deleteUser(mail: string): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/deleteUser/${mail}`);
  }
  /**
   * Get user with enhanced frontend properties
   */
  getUserEnhanced(id: number): Observable<EnhancedUser> {
    return this.apiService.get<UserDto>(`${this.endpoint}/${id}`).pipe(
      map(user => this.enhanceUser(user))
    );
  }

  /**
   * Get user's ads
   */
  getUserAdvertisments(userId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/${userId}/advertisments`);
  }

  /**
   * Get user's favorites
   */
  getUserFavorites(userId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/${userId}/favorites`);
  }

  /**
   * Add advertisment to favorites
   */
  addFavorite(userId: number, advertismentId: number): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/${userId}/favorites`, { advertismentId });
  }

  /**
   * Remove advertisment from favorites
   */
  removeFavorite(userId: number, advertismentId: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${userId}/favorites/${advertismentId}`);
  }
  /**
   * Enhances a user DTO with frontend-specific properties
   */
  private enhanceUser(userDto: UserDto): EnhancedUser {
    // Calculate age if birthdate is available
    let age: number | undefined;
    if (userDto.birthday) {
      const birthDate = new Date(userDto.birthday);
      age = this.calculateAge(birthDate);
    }

    // Format join date
    let formattedJoinDate: string | undefined;
    if (userDto.createAt) {
      const createDate = new Date(userDto.createAt);
      formattedJoinDate = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(createDate);
    }

    return {
      ...userDto,
      fullName: `${userDto.name} ${userDto.lastname}`,
      age,
      formattedJoinDate,
      // Provide a default profile image if none exists
      profileImageUrl: userDto.password ? undefined : 'assets/images/default-profile.png'
    };
  }

  /**
   * Calculate age from birthdate
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
