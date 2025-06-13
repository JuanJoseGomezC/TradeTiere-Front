import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

export interface User {
  id: number;
  name: string;
  lastname: string;
  mail: string;
  birthday?: string; // yyyy-MM-dd
  createAt?: Date;
  phone?: string;
  profileImage?: string;
  joinDate?: Date;
  password?: string;
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
  public isAuthenticated$: Observable<boolean> = this.currentUserSubject.asObservable().pipe(
    map(user => !!user)
  );
  private loadUserFromStorage() {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem('current_user');
    const sessionExpiration = localStorage.getItem('session_expiration');

    // Verificar si hay token y datos de usuario en localStorage
    if (token && userJson) {
      try {
        // Verificar si la sesión ha expirado (si se estableció una fecha de expiración)
        if (sessionExpiration && new Date(sessionExpiration) < new Date()) {
          console.log('AuthService: Sesión expirada, cerrando sesión...');
          this.logout();
          return;
        }

        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        console.log('AuthService: Sesión restaurada correctamente');

        // Opcionalmente, refrescar los datos del usuario en segundo plano
        this.refreshUserData().subscribe({
          next: () => console.log('AuthService: Datos de usuario actualizados al restaurar sesión'),
          error: (err) => {
            console.error('AuthService: Error al actualizar datos al restaurar sesión:', err);
            this.logout();
          }
        });
      } catch (e) {
        console.error('AuthService: Error al cargar datos de sesión:', e);
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

    // Si el ID del usuario es 0, es un usuario ficticio creado después del login/registro
    // En este caso, obtener los datos del usuario actual (me)
    if (currentUser.id === 0) {
      return this.apiService.get<User>('/user/me').pipe(
        tap(user => {
          console.log('AuthService: Datos de usuario obtenidos:', user);
          localStorage.setItem('current_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('AuthService: Error al obtener datos del usuario:', error);
          if (error.status === 401) {
            this.logout();
          }
          return throwError(() => new Error('Error al obtener datos del usuario.'));
        })
      );
    }

    // Si el ID es válido, obtener los datos usando el ID
    return this.apiService.get<User>(`/user/${currentUser.id}`).pipe(
      tap(user => {
        console.log('AuthService: Datos de usuario obtenidos:', user);
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('AuthService: Error al obtener datos del usuario:', error);
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => new Error('Error al obtener datos del usuario.'));
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    // Use the ApiService to call the backend login endpoint
    const loginDto: LoginDto = { mail: email, password };

    console.log('AuthService: Intentando iniciar sesión', { email });

    return this.apiService.post<TokenDto>('/auth/login', loginDto).pipe(
      // Primero, procesar la respuesta del login
      tap(response => {
        console.log('AuthService: Login exitoso, respuesta:', response);

        // Verificar que la respuesta contiene un token
        if (!response || !response.token) {
          throw new Error('Respuesta inválida del servidor: falta el token');
        }

        // Store token in local storage
        localStorage.setItem(this.tokenKey, response.token);

        // Establecer fecha de expiración de la sesión (por ejemplo, 7 días)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // 7 días a partir de ahora
        localStorage.setItem('session_expiration', expirationDate.toISOString());

        // After login, create a dummy user object that will be replaced with actual API data
        const email = loginDto.mail;
        const dummyUser: User = {
          id: 0, // Will be updated when real data is fetched
          mail: email,
          name: '',
          lastname: ''
        };

        localStorage.setItem('current_user', JSON.stringify(dummyUser));
        this.currentUserSubject.next(dummyUser);
      }),
      // Luego, obtener los datos completos del usuario
      switchMap(() => {
        console.log('AuthService: Obteniendo datos completos del usuario');
        return this.refreshUserData();
      }),
      // Capturar cualquier error durante el procesamiento
      catchError(error => {
        console.error('AuthService: Error en el inicio de sesión:', error);

        // Si es un error 401, las credenciales son inválidas
        if (error.status === 401) {
          return throwError(() => new Error('Credenciales inválidas. Por favor, inténtelo de nuevo.'));
        }

        // Para otros errores, mensaje genérico
        return throwError(() => new Error('Error durante el inicio de sesión. Por favor, inténtelo de nuevo.'));
      })
    );
  }

  register(registerData: RegisterDto): Observable<User> {
    // Use the ApiService to call the backend register endpoint
    console.log('AuthService: Intentando registrar usuario', registerData);
    return this.apiService.post<TokenDto>('/auth/register', registerData).pipe(
      tap(response => {
        console.log('AuthService: Registro exitoso, respuesta:', response);
        // Store token in local storage
        localStorage.setItem(this.tokenKey, response.token);

        // Establecer fecha de expiración de la sesión (por ejemplo, 7 días)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // 7 días a partir de ahora
        localStorage.setItem('session_expiration', expirationDate.toISOString());

        // Create a temporary user object from registration data
        const dummyUser: User = {
          id: 0, // Will be updated when real data is fetched
          mail: registerData.mail,
          name: registerData.name,
          lastname: registerData.lastname
        };

        localStorage.setItem('current_user', JSON.stringify(dummyUser));
        this.currentUserSubject.next(dummyUser);
      }),
      // Luego, obtener los datos completos del usuario
      switchMap(() => {
        console.log('AuthService: Obteniendo datos completos del usuario después del registro');
        return this.refreshUserData();
      }),
      catchError(error => {
        console.error('AuthService: Error en el registro:', error);
        return throwError(() => new Error('Error durante el registro. Por favor, inténtelo de nuevo.'));
      })
    );
  }

  logout() {
    // Remove user from local storage and set current user to null
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('current_user');
    localStorage.removeItem('session_expiration');
    console.log('AuthService: Sesión cerrada');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this.currentUserValue;

    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // Create payload that matches UpdateUserDto
    const updateData = {
      name: userData.name,
      lastname: userData.lastname,
      birthday: userData.birthday, // Already string yyyy-MM-dd
      password: (userData as any).password // Include password if it's being changed
    };

    // Use the apiService to update the user profile
    return this.apiService.put<User>('/user/updateProfile', updateData).pipe(
      tap(updatedUser => {
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(error => {
        return throwError(() => new Error('Error al actualizar el perfil. Inténtelo de nuevo.'));
      })
    );
  }

  /**
   * Renueva la sesión del usuario para extender su duración
   */
  renewSession(): void {
    if (!this.isLoggedIn) return;

    // Establecer una nueva fecha de expiración (por ejemplo, 7 días)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 días a partir de ahora
    localStorage.setItem('session_expiration', expirationDate.toISOString());

    console.log('AuthService: Sesión renovada hasta', expirationDate.toLocaleString());
  }
}
