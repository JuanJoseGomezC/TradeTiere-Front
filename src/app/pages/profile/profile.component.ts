import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService, UpdateProfileDto, UserProfile } from '../../services/profile.service';
import { AuthService, User } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, switchMap, tap, of } from 'rxjs';
import { CreateAdModalComponent } from "../../components/create-ad-modal/create-ad-modal.component";
import { AdvertismentService } from '../../services/advertisment.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';

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
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule, CreateAdModalComponent, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule],
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

  // Password change variables
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';
  passwordSuccess: string = '';
  isChangingPassword: boolean = false;

  // Delete account variables
  showDeleteConfirm = false;
  deleteConfirmText = '';
  isDeletingUser = false;
  deleteError: string = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private advertismentService: AdvertismentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadingError = null;

    // Si hay un parámetro :id en la ruta, cargar ese perfil, si no el del usuario autenticado
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      // Perfil público de otro usuario
      const userId = parseInt(routeId, 10);
      this.profileService.getProfile(userId).subscribe({
        next: (profile) => {
          this.profile = profile;
          this.editableProfile = { ...profile };
          this.loadUserAds();
          this.isLoading = false;
        },
        error: (error) => {
          this.loadingError = 'No se pudo cargar el perfil del usuario.';
          this.isLoading = false;
        }
      });
    } else {
      // Perfil propio (requiere autenticación)
      if (!this.authService.isLoggedIn) {
        this.router.navigate(['/login']);
        return;
      }
      this.authService.refreshUserData().pipe(
        catchError(error => {
          return of(this.authService.getCurrentUser());
        }),
        switchMap(user => {
          const currentUser = user || this.authService.getCurrentUser();
          if (!currentUser || !currentUser.id) {
            this.loadingError = 'No se pudo cargar el perfil. Por favor, inicia sesión nuevamente.';
            this.isLoading = false;
            return of(null);
          }
          return this.profileService.getProfile(currentUser.id).pipe(
            tap(profile => {
              this.profile = profile;
              this.editableProfile = { ...profile };
              this.loadUserAds();
              this.loadFavoriteAds();
              this.isLoading = false;
            }),
            catchError(error => {
              this.loadingError = 'Error al cargar el perfil. Inténtalo más tarde.';
              this.isLoading = false;
              return of(null);
            })
          );
        })
      ).subscribe();
    }
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
            location: ad.location.name,
            publishedDate: ad.create_at,
            status: ad.state ? 'active' : 'sold',
            thumbnailUrl: ad.image?.imageBase64 || 'assets/images/default-ad.png',
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
      const validationError = this.validateRegisterFields({
        mail: this.editableProfile.mail || '',
        birthdate: this.editableProfile.birthday || '',
        password: ''
      }, false);
      if (validationError) {
        return;
      }
      this.isLoading = true;
      let updateData: any = {
        name: this.editableProfile.name,
        lastname: this.editableProfile.lastname
      };
      if (this.editableProfile.birthday) {
        updateData.birthday = this.editableProfile.birthday;
      }
      this.profileService.updateProfile(updateData as any).subscribe(
        (updatedProfile) => {
          if (this.profile) {
            // Mantener el id original y forzar el tipo correcto
            const id = this.profile.id;
            this.profile = { ...this.profile, ...updateData, id } as UserProfile;
            this.editableProfile = { ...this.profile };
          }
          this.isEditing = false;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.isLoading = false;
        }
      );
    }
  }

  onChangePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';
    if (!this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Todos los campos son obligatorios.';
      return;
    }
    if (this.newPassword.length < 8) {
      this.passwordError = 'La nueva contraseña debe tener al menos 8 caracteres.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden.';
      return;
    }
    this.isChangingPassword = true;
    // Llamar al mismo endpoint que saveProfile, enviando solo password
    const updateData: UpdateProfileDto = {
      password: this.newPassword
    };
    this.profileService.updateProfile(updateData).subscribe({
      next: () => {
        this.passwordSuccess = 'Contraseña actualizada correctamente.';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isChangingPassword = false;
      },
      error: (err) => {
        this.passwordError = err.message || 'Error al actualizar la contraseña.';
        this.isChangingPassword = false;
      }
    });
  }

  // Formatea la fecha a yyyy-MM-dd
  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
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

  async deleteAccount(): Promise<void> {
    if (!this.profile?.mail) return;
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta y todos tus datos. Escribe CONFIRMAR para continuar.',
      input: 'text',
      inputPlaceholder: 'CONFIRMAR',
      inputValidator: (value) => {
        if (value !== 'CONFIRMAR') {
          return 'Debes escribir CONFIRMAR para eliminar tu cuenta.';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
      preConfirm: (value) => value === 'CONFIRMAR'
    });
    if (result.isConfirmed && result.value) {
      this.isDeletingUser = true;
      this.deleteError = '';
      this.profileService.deleteUserByMail(this.profile.mail).subscribe({
        next: () => {
          this.isDeletingUser = false;
          Swal.fire('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.', 'success').then(() => {
            this.authService.logout();
          });
        },
        error: (err) => {
          this.isDeletingUser = false;
          Swal.fire('Error', err?.message || 'Error al eliminar la cuenta.', 'error');
        }
      });
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
