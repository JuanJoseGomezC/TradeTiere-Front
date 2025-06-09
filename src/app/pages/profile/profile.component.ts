import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService, UserProfile } from '../../services/profile.service';
import { AuthService, User } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, switchMap, tap, of } from 'rxjs';
import { CreateAdModalComponent } from "../../components/create-ad-modal/create-ad-modal.component";
import { AdvertismentService } from '../../services/advertisment.service';

interface UserAd {
  id: number;
  title: string;
  price: number;
  location: string;
  publishedDate: Date;
  status: 'active' | 'pending' | 'sold';
  thumbnailUrl: string;
  views: number;
  favorites: number;
}

interface FavoriteAd {
  id: number;
  title: string;
  price: number;
  location: string;
  publishedDate: Date;
  thumbnailUrl: string;
  sellerName: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule, CreateAdModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  activeTab: 'info' | 'ads' | 'favorites' | 'messages' | 'settings' = 'info';
  profile: UserProfile | null = null;
  userAds: UserAd[] = [];
  favoriteAds: FavoriteAd[] = [];
  isEditing = false;
  editableProfile: UserProfile | null = null;
  isLoading = true;
  messageCount = 5;
  loadingError: string | null = null;
  showCreateAdModal = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private advertismentService: AdvertismentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadingError = null;

    // Verificar estado de autenticación
    if (!this.authService.isLoggedIn) {
      console.log('ProfileComponent: Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return;
    }

    // Intentar refrescar los datos del usuario primero
    this.authService.refreshUserData().pipe(
      catchError(error => {
        console.error('ProfileComponent: Error al actualizar datos del usuario:', error);
        // Aun con error, intentar usar los datos almacenados en cache
        return of(this.authService.getCurrentUser());
      }),
      switchMap(user => {
        // Get current user después de refresh
        const currentUser = user || this.authService.getCurrentUser();

        if (!currentUser || !currentUser.id) {
          console.error('ProfileComponent: No hay usuario autenticado después de refresh');
          this.loadingError = 'No se pudo cargar el perfil. Por favor, inicia sesión nuevamente.';
          this.isLoading = false;
          return of(null);
        }

        console.log('ProfileComponent: Cargando perfil con ID:', currentUser.id);
        return this.profileService.getProfile(currentUser.id).pipe(
          tap(profile => {
            this.profile = profile;
            this.editableProfile = { ...profile };
            this.loadUserAds();
            this.loadFavoriteAds();
            this.isLoading = false;
            console.log(profile);
          }),
          catchError(error => {
            console.error('ProfileComponent: Error cargando perfil:', error);
            this.loadingError = 'Error al cargar el perfil. Inténtalo más tarde.';
            this.isLoading = false;
            return of(null);
          })
        );
      })
    ).subscribe();
  }

  loadUserAds(): void {
    if (this.profile && this.profile.mail) {
      // Use advertisment service to get user's ads
      this.advertismentService.getUserAdvertisments(this.profile.mail).subscribe(
        (ads) => {
        // Map the API advertisments to the UI representation
          this.userAds = ads.map(ad => ({
            id: ad.id ?? 0, // Provide a default value of 0 if id is undefined
            title: ad.title,
            price: ad.price,
            location: this.getLocationName(ad.location),
            publishedDate: ad.create_at,
            status: ad.state ? 'active' : 'sold',
            thumbnailUrl: ad.images?.[0] || 'assets/images/default-ad.png',
            views: ad.views || 0,
            favorites: 0 // TODO: Add when favorites API is available
          }));
        },
        (error) => {
          console.error('Error loading user ads:', error);
        }
      );
    } else {
      this.userAds = [];
    }
  }  // Helper method to convert location ID to readable name
  private getLocationName(locationId: number): string {
    // This would ideally come from a location service or API
    const locationMap: Record<number, string> = {
      1: 'Sevilla',
      2: 'Madrid',
      3: 'Barcelona',
      4: 'Valencia',
      // Add more locations as needed
    };

    return locationMap[locationId] || 'Desconocido';
  }

  loadFavoriteAds(): void {
    // Cargar favoritos desde localStorage
    const key = 'favoriteAds';
    let favorites: any[] = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) favorites = JSON.parse(stored);
    } catch {}
    this.favoriteAds = favorites;
  }

  changeTab(tab: 'info' | 'ads' | 'favorites' | 'messages' | 'settings'): void {
    this.activeTab = tab;
  }

  startEditing(): void {
    if (this.profile) {
      this.editableProfile = { ...this.profile };
      this.isEditing = true;
    }
  }

  cancelEditing(): void {
    if (this.profile) {
      this.editableProfile = { ...this.profile };
    }
    this.isEditing = false;
  }

  saveProfile(): void {
    if (this.editableProfile && this.editableProfile.id) {
      // Validar antes de guardar (sin validar contraseña en edición de perfil)
      const validationError = this.validateRegisterFields({
        mail: this.editableProfile.mail || '',
        birthdate: this.editableProfile.birthday ? this.editableProfile.birthday : '',
        password: ''
      }, false);
      if (validationError) {
        alert(validationError);
        return;
      }

      this.isLoading = true;
      this.profileService.updateProfile(this.editableProfile).subscribe(
        (updatedProfile) => {
          this.profile = updatedProfile;
          this.editableProfile = { ...updatedProfile };
          this.isEditing = false;
          this.isLoading = false;
          alert('Perfil actualizado con éxito');
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.isLoading = false;
          alert('Error al actualizar el perfil');
        }
      );
    }
  }

  removeFromFavorites(adId: number) {
    const key = 'favoriteAds';
    let favorites: any[] = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) favorites = JSON.parse(stored);
    } catch {}
    favorites = favorites.filter(ad => ad.id !== adId);
    localStorage.setItem(key, JSON.stringify(favorites));
    this.favoriteAds = favorites;
  }
  openCreateAdModal() {
    this.showCreateAdModal = true;
   document.body.classList.add('modal-open');
  }

  closeCreateAdModal() {
    this.showCreateAdModal = false;
    document.body.classList.remove('modal-open');
  }

  markAsSold(adId: number): void {
    const ad = this.userAds.find(ad => ad.id === adId);
    if (ad) {
      ad.status = 'sold';

      // Update in the backend - set state to false (sold)
      this.advertismentService.updateAdStatus(adId, false).subscribe(
        () => console.log('Ad marked as sold'),
        (error) => console.error('Error marking ad as sold:', error)
      );
    }
  }

  deleteAd(adId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      this.advertismentService.deleteAdvertisment(adId).subscribe(
        () => {
          this.userAds = this.userAds.filter(ad => ad.id !== adId);
          console.log('Ad deleted successfully');
        },
        (error) => {
          console.error('Error deleting ad:', error);
          alert('Error al eliminar el anuncio');
        }
      );
    }
  }

  validateRegisterFields(register: { mail: string; birthdate: string | Date; password: string; }, validatePassword: boolean = true): string | null {
    // Email
    if (!/^[\w-\.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(register.mail)) {
      return 'El email no tiene un formato válido.';
    }
    // Edad >= 18 años
    const birth = new Date(register.birthdate);
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    if (birth > minDate) {
      return 'Debes tener al menos 18 años para registrarte.';
    }
    if (validatePassword) {
      // Contraseña longitud
      if (!register.password || register.password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres.';
      }
      // Contraseña: mayúscula, minúscula y dígito
      if (!/[A-Z]/.test(register.password) || !/[a-z]/.test(register.password) || !/\d/.test(register.password)) {
        return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.';
      }
    }
    return null;
  }
}
