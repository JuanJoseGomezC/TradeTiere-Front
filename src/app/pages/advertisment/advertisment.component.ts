import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Advertisment, AdvertismentService } from '../../services/advertisment.service';

@Component({
  selector: 'app-advertisment',
  imports: [CommonModule, RouterModule],
  templateUrl: './advertisment.component.html',
  styleUrl: './advertisment.component.css'
})
export class AdvertismentComponent implements OnInit {
  advertisment: Advertisment | null = null;
  loading = true;
  error = false;
  currentImageIndex = 0;

  // Mock data for development
  mockAd: Advertisment = {
    id: 1,
    title: 'Golden Retriever Cachorro - Pedigree Completo',
    description: 'Hermoso cachorro Golden Retriever de 3 meses con pedigree completo. Vacunado, desparasitado y socializado. Los padres son campeones de exposición. Ideal para familias con niños. Muy juguetón y cariñoso.',
    price: 1200,
    location: 1,
    specie: 1,
    race: 1,
    language: 1,
    birthdate: new Date('2024-01-15'),
    gender: 'Macho',
    state: true,
    create_at: new Date('2024-01-15'),
    // Frontend properties
    category: 'otros',
    breed: 'Golden Retriever',
    age: 3,
    province: 'Madrid',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop'
    ],
    sellerId: 1,
    sellerName: 'Carlos García',
    sellerRating: 4.8,
    sellerJoinDate: new Date('2023-05-10'),
    views: 145,
    favorite: false
  };

  relatedAds: Advertisment[] = [
    {
      id: 2,
      title: 'Labrador Retriever Adulto',
      price: 800,
      images: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop'],
      province: 'Barcelona',
      age: 24
    } as Advertisment,
    {
      id: 3,
      title: 'Golden Retriever Hembra',
      price: 1000,
      images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop'],
      province: 'Valencia',
      age: 6
    } as Advertisment,
    {
      id: 4,
      title: 'Cachorro Pastor Alemán',
      price: 900,
      images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&h=200&fit=crop'],
      province: 'Sevilla',
      age: 4
    } as Advertisment
  ];

  features = [
    'Pedigree completo',
    'Vacunado al día',
    'Desparasitado',
    'Microchip implantado',
    'Socializado con niños',
    'Entrenamiento básico',
    'Certificado veterinario'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advertismentService: AdvertismentService
  ) {}

  ngOnInit() {
    this.loadAdvertisment();
  }

  loadAdvertisment() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // For now, use mock data
      setTimeout(() => {
        this.advertisment = this.mockAd;
        this.loading = false;
      }, 500);

      // In real app, you would call:
      // this.advertismentService.getAdvertismentById(parseInt(id)).subscribe({
      //   next: (ad) => {
      //     this.advertisment = ad;
      //     this.loading = false;
      //   },
      //   error: () => {
      //     this.error = true;
      //     this.loading = false;
      //   }
      // });
    }
  }

  nextImage() {
    if (this.advertisment?.images && this.currentImageIndex < this.advertisment.images.length - 1) {
      this.currentImageIndex++;
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
      this.advertisment.favorite = !this.advertisment.favorite;
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
        url: window.location.href
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
    if (this.advertisment?.age) {
      return this.advertisment.age === 1 ? '1 mes' : `${this.advertisment.age} meses`;
    }
    return 'No especificada';
  }

  formatPrice(): string {
    return this.advertisment?.price?.toLocaleString('es-ES') + ' €' || '0 €';
  }
}
