import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Advertisment, AdvertismentDto, AdvertismentService } from '../../services/advertisment.service';
import { UserService } from '../../services/user.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-advertisment',
  imports: [CommonModule, RouterModule],
  templateUrl: './advertisment.component.html',
  styleUrl: './advertisment.component.css',
})
export class AdvertismentComponent implements OnInit {
  advertisment: Advertisment | null = null;
  loading = true;
  error = false;
  currentImageIndex = 0;

  // Mock data for development
  // mockAdDto: Advertisment = {
  //   id: 1,
  //   title: 'Golden Retriever Cachorro - Pedigree Completo',
  //   description:
  //     'Hermoso cachorro Golden Retriever de 3 meses con pedigree completo. Vacunado, desparasitado y socializado. Los padres son campeones de exposición. Ideal para familias con niños. Muy juguetón y cariñoso.',
  //   price: 1200,
  //   location: 1,
  //   specie: {
  //     id: 1,
  //     name: 'Perro',
  //     language: 1,
  //   },
  //   race: {
  //     id: 1,
  //     name: 'Golden Retriever',
  //     specie: 1,
  //     language: 1,
  //   },
  //   language: 1,
  //   birthdate: new Date('2024-01-15'),
  //   gender: 'Macho',
  //   state: true,
  //   create_at: new Date('2024-01-15'),
  //   image: {
  //     imageBase64: '',
  //     name: 'golden1.jpg',
  //     contentType: 'image/jpeg',
  //   },
  // };

  // relatedAds: Advertisment[] = [
  //   {
  //     id: 2,
  //     title: 'Labrador Retriever Adulto',
  //     price: 800,
  //     images: [
  //       'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop',
  //     ],
  //     province: 'Barcelona',
  //     age: 24,
  //   } as Advertisment,
  //   {
  //     id: 3,
  //     title: 'Golden Retriever Hembra',
  //     price: 1000,
  //     images: [
  //       'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
  //     ],
  //     province: 'Valencia',
  //     age: 6,
  //   } as Advertisment,
  //   {
  //     id: 4,
  //     title: 'Cachorro Pastor Alemán',
  //     price: 900,
  //     images: [
  //       'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&h=200&fit=crop',
  //     ],
  //     province: 'Sevilla',
  //     age: 4,
  //   } as Advertisment,
  // ];

  features = [
    'Pedigree completo',
    'Vacunado al día',
    'Desparasitado',
    'Microchip implantado',
    'Socializado con niños',
    'Entrenamiento básico',
    'Certificado veterinario',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advertismentService: AdvertismentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadAdvertisment();
  }

  loadAdvertisment() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.advertismentService.getAdvertismentById(parseInt(id)).subscribe({
        next: (ad) => {
          if (ad) {
            this.advertisment = ad;

            // Si no hay imagen válida, dejarla en null
            if (
              !this.advertisment.image ||
              !this.advertisment.image.imageBase64
            ) {
              this.advertisment.image = null;
            }

            // Marcar favorito si está en localStorage
            try {
              const stored = localStorage.getItem('favoriteAds');
              if (stored) {
                const favorites = JSON.parse(stored);
                this.advertisment.favorite = favorites.some((fav: any) => fav.id === this.advertisment!.id);
              } else {
                this.advertisment.favorite = false;
              }
            } catch {
              this.advertisment.favorite = false;
            }

            // Obtener nombre del vendedor
            if (ad.userId) {
              this.userService
                .getUserEnhanced(ad.userId)
                .pipe(
                  catchError(() => of({ fullName: 'Anunciante desconocido' }))
                )
                .subscribe((user) => {
                  if (this.advertisment) {
                    this.advertisment.sellerName =
                      user.fullName || 'Anunciante desconocido';
                  }
                });
            } else {
              if (this.advertisment) {
                this.advertisment.sellerName = 'Anunciante desconocido';
              }
            }
          } else {
            this.error = true;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = true;
          this.loading = false;
        },
      });

    } else {
      this.error = true;
      this.loading = false;
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
  }

  toggleFavorite() {
    if (this.advertisment) {
      const key = 'favoriteAds';
      let favorites: any[] = [];
      try {
        const stored = localStorage.getItem(key);
        if (stored) favorites = JSON.parse(stored);
      } catch {}
      if (!this.advertisment.favorite) {
        // Añadir a favoritos
        if (!favorites.some(ad => ad.id === this.advertisment!.id)) {
          favorites.push({
            id: this.advertisment.id,
            title: this.advertisment.title,
            price: this.advertisment.price,
            location: this.advertisment.location && this.advertisment.location.name ? this.advertisment.location.name : '',
            publishedDate: this.advertisment.create_at,
            thumbnailUrl: this.advertisment.image || '',
            sellerName: this.advertisment.sellerName || '',
            locationFull: this.advertisment.location,
            createAt: this.advertisment.create_at,
            image: this.advertisment?.image || null
          });
        }
        this.advertisment.favorite = true;
      } else {
        // Quitar de favoritos
        favorites = favorites.filter(ad => ad.id !== this.advertisment!.id);
        this.advertisment.favorite = false;
      }
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }

  contactSeller() {
    // Implementar lógica de contacto
    alert('Función de contacto - implementar modal o redirección');
  }

  shareAd() {
    if (navigator.share) {
      navigator.share({
        title: this.advertisment?.title,
        text: this.advertisment?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('URL copiada al portapapeles');
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
  viewRelatedAd(adId: number | undefined) {
    if (adId !== undefined) {
      this.router.navigate(['/advertisment', adId]);
    }
  }

  getAge(): string {
    if (this.advertisment?.birthdate) {
      return this.calculateAge(new Date(this.advertisment?.birthdate));
    }
    return 'No especificada';
  }
  private calculateAge(birthdate: Date): string {
    const today = new Date();
    let years = today.getFullYear() - birthdate.getFullYear();
    let months = today.getMonth() - birthdate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthdate.getDate())) {
      years--;
      months = (months + 12) % 12;
    }
    if (years > 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
    if (months > 0) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    return 'Recién nacido';
  }
  formatPrice(): string {
    return this.advertisment?.price?.toLocaleString('es-ES') + ' €' || '0 €';
  }

  goToSellerProfile() {
    // Navega al perfil público del vendedor usando su sellerId
    if (this.advertisment && this.advertisment.sellerId) {
      this.router.navigate(['/public-profile', this.advertisment.sellerId]);
    } else {
      alert('No se puede acceder al perfil del vendedor.');
    }
  }
}
