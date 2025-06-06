import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService, UserProfile } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { AdvertisementService, Advertisement } from '../../services/advertisement.service';
import { HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
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

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private advertisementService: AdvertisementService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Get current user
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.id) {
      // Load user profile using the profile service
      this.profileService.getProfile(currentUser.id).subscribe(
        (profile) => {
          this.profile = profile;
          this.editableProfile = { ...profile };
          this.loadUserAds();
          this.loadFavoriteAds();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading profile:', error);
          this.isLoading = false;
        }
      );
    } else {
      // No logged in user
      this.profile = null;
      this.isLoading = false;
    }
  }

  loadUserAds(): void {
    if (this.profile && this.profile.mail) {
      // Use advertisement service to get user's ads
      this.advertisementService.getUserAdvertisements(this.profile.mail).subscribe(
        (ads) => {
          // Map the API advertisements to the UI representation
          this.userAds = ads.map(ad => ({
            id: ad.id,
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
  }

  // Helper method to convert location ID to readable name
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
    if (this.profile && this.profile.id) {
      // TODO: Replace with actual API call when favorites endpoint is available
      // this.advertisementService.getUserFavorites(this.profile.id).subscribe(
      //   (favoriteAds) => {
      //     this.favoriteAds = favoriteAds.map(ad => ({
      //       id: ad.id,
      //       title: ad.title,
      //       price: ad.price,
      //       location: this.getLocationName(ad.location),
      //       publishedDate: ad.create_at,
      //       thumbnailUrl: ad.images?.[0] || 'assets/images/default-ad.png',
      //       sellerName: ad.sellerName || 'Vendedor'
      //     }));
      //   },
      //   (error) => {
      //     console.error('Error loading favorite ads:', error);
      //   }
      // );

      // Mock data for now
      this.favoriteAds = [
        {
          id: 101,
          title: 'Toro Limousin para semental',
          price: 1800,
          location: 'Granada, Andalucía',
          publishedDate: new Date('2025-05-15'),
          thumbnailUrl: 'https://images.unsplash.com/photo-1584935385343-927439571c4f',
          sellerName: 'Ganadería López'
        },
        {
          id: 102,
          title: 'Cerdo ibérico puro de bellota',
          price: 350,
          location: 'Huelva, Andalucía',
          publishedDate: new Date('2025-05-10'),
          thumbnailUrl: 'https://images.unsplash.com/photo-1516467913134-01c66300b80f',
          sellerName: 'Dehesa Extremeña'
        }
      ];
    }
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

  removeFromFavorites(adId: number): void {
    this.favoriteAds = this.favoriteAds.filter(ad => ad.id !== adId);
    // TODO: Implement when API is ready
    // if (this.profile && this.profile.id) {
    //   this.advertisementService.removeFromFavorites(this.profile.id, adId).subscribe(
    //     () => console.log('Ad removed from favorites'),
    //     (error) => console.error('Error removing from favorites:', error)
    //   );
    // }
  }

  markAsSold(adId: number): void {
    const ad = this.userAds.find(ad => ad.id === adId);
    if (ad) {
      ad.status = 'sold';

      // Update in the backend - set state to false (sold)
      this.advertisementService.updateAdStatus(adId, false).subscribe(
        () => console.log('Ad marked as sold'),
        (error) => console.error('Error marking ad as sold:', error)
      );
    }
  }

  deleteAd(adId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      this.advertisementService.deleteAdvertisement(adId).subscribe(
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
}
