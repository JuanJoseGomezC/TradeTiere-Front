import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Advertisment,
  AdvertismentService,
} from '../../services/advertisment.service';
import { LocationService } from '../../services/location.service';
import { LanguageService } from '../../services/language.service';
import { SpecieService } from '../../services/specie.service';
import { RaceService } from '../../services/race.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  advertisments: Advertisment[] = [];
  filteredAds: Advertisment[] = [];
  loading = true;
  error: string | null = null;
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;
  // Filter variables
  especieSeleccionada: string = '';
  razaSeleccionada: string = '';
  minPrice: number = 0;
  maxPrice: number = 10000;
  searchTerm: string = '';
  maxSliderValue: number = 10000; // Valor máximo del slider de precio

  // Flags to track if price filters are active
  isMinPriceActive: boolean = false;
  isMaxPriceActive: boolean = false;

  // Available species (especies)
  especies: any[] = [];
  razas: any[] = [];
  razasFiltradas: any[] = [];

  // Filtros avanzados
  locations: any[] = [];
  languages: any[] = [];
  selectedLocation: string = '';
  selectedLanguage: string = '';
  selectedGender: string = '';
  minAge: number | null = null;
  maxAge: number | null = null;
  minDate: string = '';
  maxDate: string = '';

  // Nuevo variable para el término de búsqueda de razas
  breedSearchTerm: string = '';

  // Controlar la visibilidad del buscador de razas
  showBreedSearch: boolean = false;

  constructor(
    private advertismentService: AdvertismentService,
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private languageService: LanguageService,
    private specieService: SpecieService,
    private raceService: RaceService,
    private userService: UserService, // Añadido
    private authService: AuthService // Añadir AuthService
  ) {}

  ngOnInit(): void {
    // Verificar estado de autenticación
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        // Solo cargar anuncios si está autenticado
        if (isAuthenticated) {
          this.cargadatos();
        } else {
          this.loading = false;
        }
      }
    );
  }

  cargadatos(): void{
    // Cargar especies desde la base de datos
    this.specieService.getAll().subscribe((species) => {
      this.especies = species;
    });
    // Cargar localizaciones e idiomas desde la base de datos
    this.locationService.getAll().subscribe((locs) => (this.locations = locs));
    this.languageService
      .getAll()
      .subscribe((langs) => (this.languages = langs));
    // No cargar razas globalmente, solo al seleccionar especie
    // this.updateBreedsFromDB();
    this.locationService.getAll().subscribe((locs) => (this.locations = locs));
    this.languageService
      .getAll()
      .subscribe((langs) => (this.languages = langs));
    // Cargar todas las razas al inicio (opcional, para filtrar después)
    this.updateBreedsFromDB();

    // Check if there are filters in the query params
    this.route.queryParams.subscribe((params) => {
      if (params['especie']) {
        this.especieSeleccionada = params['especie'];
        this.updateBreedsFromDB(); // Cargar razas de la especie seleccionada
        // If there's also a raza parameter and we have filtered breeds
        if (params['raza'] && this.razasFiltradas.length > 0) {
          // Verify that the selected breed belongs to the selected especie
          const breedExists = this.razasFiltradas.some(
            (breed) => breed.id === params['raza']
          );
          if (breedExists) {
            this.razaSeleccionada = params['raza'];
          }
        }
      }

      // Get price filters from URL if present
      if (params['minPrice']) {
        this.minPrice = Number(params['minPrice']);
        this.isMinPriceActive = true;
      }

      if (params['maxPrice']) {
        this.maxPrice = Number(params['maxPrice']);
        this.isMaxPriceActive = true;
      }

      this.loadAdvertisments();
    });
  }
  ngOnDestroy(): void {
    // Limpiar subscripción
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    // Initialize slider track after DOM is fully loaded
    setTimeout(() => {
      this.updateSliderTrack();
    }, 100);
  }

  updateBreedsFromDB(): void {
    if (this.especieSeleccionada) {
      const specieId = Number(this.especieSeleccionada);
      if (!isNaN(specieId)) {
        // Obtener razas de la BBDD solo de la especie seleccionada
        this.raceService.getRacesBySpecie(specieId).subscribe((breeds) => {
          this.raceService.getRacesBySpecie(specieId).subscribe((breeds) => {
            this.razas = breeds;
            this.updateFilteredBreeds();
          });
        });
      } else {
        this.razas = [];
        this.razasFiltradas = [];
      }
    } else {
      // Si no hay especie seleccionada, no mostrar razas (ni cargar todas)
      this.razas = [];
      this.razasFiltradas = [];
      this.raceService.getAllEnhanced().subscribe((breeds) => {
        this.razas = breeds;
        this.updateFilteredBreeds();
      });
    }
  }

  // Update filtered breeds based on selected especie
  updateFilteredBreeds(): void {
    if (this.especieSeleccionada) {
      // Asegurarse de comparar correctamente el tipo de dato (string vs number)
      this.razasFiltradas = this.razas.filter((breed) => {
        // breed.specie puede ser number o string
        return (
          String(breed.specie) === String(this.especieSeleccionada) ||
          String(breed.specieId) === String(this.especieSeleccionada)
        );
      });
    } else {
      this.razasFiltradas = this.razas;
    }
  }

  // Handle especie change
  onEspecieChange(): void {
    this.razaSeleccionada = '';
    this.updateBreedsFromDB();
    this.applyFilters();
  }
  loadAdvertisments(): void {
    this.loading = true;
    this.error = null;

    this.advertismentService.getAdvertisments().subscribe({
      next: (ads) => {
        // Obtener IDs de usuario únicos
        const userIdSet = Array.from(
          new Set(
            ads
              .map((ad) => ad.userId)
              .filter((id): id is number => typeof id === 'number')
          )
        );

        // Preparar las peticiones de usuario
        const userRequests = userIdSet.map((userId) =>
          this.userService
            .getUserEnhanced(userId)
            .pipe(
              catchError(() =>
                of({ id: userId, fullName: 'Usuario desconocido' })
              )
            )
        );

        // Si no hay usuarios, igual aplicar transformaciones mínimas
        if (userRequests.length === 0) {
          const adsWithImageUrls = ads.map((ad) => ({
            ...ad,
            imageUrl:
              ad.image?.imageBase64 && ad.image?.contentType
                ? `data:${ad.image.contentType};base64,${ad.image.imageBase64}`
                : null,
          }));

          this.advertisments = adsWithImageUrls;
          this.applyFilters();
          this.loading = false;
          setTimeout(() => {
            this.updateSliderTrack();
          }, 100);
          return;
        }

        // Si hay usuarios, obtener nombres y mapear todo
        forkJoin(userRequests).subscribe(
          (users) => {
            const userMap = new Map(users.map((u) => [u.id, u.fullName]));

            const adsWithSellerAndImage = ads.map((ad) => ({
              ...ad,
              sellerName: userMap.get(ad.userId) || 'Usuario desconocido',
              imageUrl:
                ad.image?.imageBase64 && ad.image?.contentType
                  ? `data:${ad.image.contentType};base64,${ad.image.imageBase64}`
                  : null,
            }));

            this.advertisments = adsWithSellerAndImage;

            // Calcular valores de precio
            const prices = adsWithSellerAndImage.map((ad) => ad.price);
            const maxPrice = Math.max(...prices);
            if (maxPrice > 0) {
              this.maxSliderValue = Math.ceil(maxPrice / 1000) * 1000;
            }
            if (!this.isMaxPriceActive) {
              this.maxPrice = this.maxSliderValue;
            }

            // Aplicar filtros y terminar carga
            this.applyFilters();
            this.loading = false;
            setTimeout(() => {
              this.updateSliderTrack();
            }, 100);
          },
          (err) => {
            this.showError(
              'No se pudieron cargar los usuarios de los anuncios.'
            );
            this.loading = false;
          }
        );
      },
      error: (err) => {
        this.showError(
          'No se pudieron cargar los anuncios. Por favor, inténtelo de nuevo más tarde.'
        );
        this.loading = false;
      },
    });
  }

  // Nuevo método para filtrar razas por texto
  get filteredRazasBySearch(): any[] {
    if (!this.breedSearchTerm) return this.razasFiltradas;
    return this.razasFiltradas.filter((raza) =>
      raza.name.toLowerCase().includes(this.breedSearchTerm.toLowerCase())
    );
  }

  applyFilters(): void {
    try {
      let filtered = [...this.advertisments];

      // Filtrar solo anuncios activos
      filtered = filtered.filter((ad) => ad.state === true);

      // Filter by especie
      if (this.especieSeleccionada) {
        filtered = filtered.filter(
          (ad) =>
            ad.specie &&
            ad.specie.id &&
            ad.specie.id.toString() === this.especieSeleccionada
        );
      }

      // Filter by raza
      if (this.razaSeleccionada) {
        const selectedBreedName = this.razas.find(
          (b) => b.id === this.razaSeleccionada
        )?.name;
        if (selectedBreedName) {
          filtered = filtered.filter(
            (ad) =>
              (ad.race && ad.race.toString() === this.razaSeleccionada) ||
              (ad.breed &&
                ad.breed.toLowerCase() === selectedBreedName.toLowerCase())
          );
        }
      }

      // Filter by price range
      console.log(
        `Applying filters - Min price: ${this.minPrice}, isActive: ${this.isMinPriceActive}, Max price: ${this.maxPrice}, isActive: ${this.isMaxPriceActive}`
      );

      // Aplicar filtro de precio mínimo
      if (this.minPrice > 0) {
        filtered = filtered.filter((ad) => ad.price >= this.minPrice);
        this.isMinPriceActive = true;
        console.log(
          `Filtered by min price: ${this.minPrice}. Remaining ads: ${filtered.length}`
        );
      } else {
        this.isMinPriceActive = false;
      }

      // Aplicar filtro de precio máximo
      if (this.maxPrice < this.maxSliderValue) {
        filtered = filtered.filter((ad) => ad.price <= this.maxPrice);
        this.isMaxPriceActive = true;
        console.log(
          `Filtered by max price: ${this.maxPrice}. Remaining ads: ${filtered.length}`
        );
      } else {
        this.isMaxPriceActive = false;
      }

      // Filter by localización
      if (this.selectedLocation) {
        filtered = filtered.filter(
          (ad) => ad.province === this.selectedLocation
        );
      }
      // Filter by idioma
      if (this.selectedLanguage) {
        filtered = filtered.filter(
          (ad) => String(ad.language) === String(this.selectedLanguage)
        );
      }
      // Filter by género
      if (this.selectedGender) {
        filtered = filtered.filter((ad) => ad.gender === this.selectedGender);
      }
      // Filter by edad
      if (this.minAge !== null) {
        filtered = filtered.filter(
          (ad) => ad.age !== undefined && ad.age >= this.minAge!
        );
      }
      if (this.maxAge !== null) {
        filtered = filtered.filter(
          (ad) => ad.age !== undefined && ad.age <= this.maxAge!
        );
      }
      // Filter by fecha de publicación
      if (this.minDate) {
        filtered = filtered.filter(
          (ad) =>
            ad.create_at && new Date(ad.create_at) >= new Date(this.minDate)
        );
      }
      if (this.maxDate) {
        filtered = filtered.filter(
          (ad) =>
            ad.create_at && new Date(ad.create_at) <= new Date(this.maxDate)
        );
      }

      // Filter by search term
      if (this.searchTerm.trim() !== '') {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (ad) =>
            ad.title.toLowerCase().includes(term) ||
            ad.description.toLowerCase().includes(term) ||
            (ad.breed && ad.breed.toLowerCase().includes(term)) ||
            (ad.specie && ad.specie.name.toLowerCase().includes(term))
        );
      }

      this.filteredAds = filtered;

      // Update URL with all filters
      const queryParams: any = {};
      if (this.especieSeleccionada) {
        queryParams.especie = this.especieSeleccionada;
      }
      if (this.razaSeleccionada) {
        queryParams.raza = this.razaSeleccionada;
      }
      if (this.isMinPriceActive && this.minPrice > 0) {
        queryParams.minPrice = this.minPrice;
      }
      if (this.isMaxPriceActive && this.maxPrice < this.maxSliderValue) {
        queryParams.maxPrice = this.maxPrice;
      }
      if (this.searchTerm) {
        queryParams.search = this.searchTerm;
      }

      // Only update params if we have filters
      if (Object.keys(queryParams).length > 0) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: 'merge',
        });
      }
    } catch (e) {
      this.showError('Ocurrió un error al aplicar los filtros.');
    }
  }

  showError(message: string): void {
    this.error = message;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#d33',
    });
  }

  resetFilters(): void {
    this.especieSeleccionada = '';
    this.razaSeleccionada = '';
    this.minPrice = 0;
    this.maxPrice = this.maxSliderValue;
    this.isMinPriceActive = false;
    this.isMaxPriceActive = false;
    this.searchTerm = '';
    this.razasFiltradas = []; // Clear filtered breeds
    this.selectedLocation = '';
    this.selectedLanguage = '';
    this.selectedGender = '';
    this.minAge = null;
    this.maxAge = null;
    this.minDate = '';
    this.maxDate = '';

    // Update slider track UI
    setTimeout(() => {
      this.updateSliderTrack();
    }, 10);

    this.applyFilters();

    // Remove query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  toggleFavorite(ad: Advertisment): void {
    ad.favorite = !ad.favorite;
    // In a real application, you would call the service to update the favorite status
    // this.advertismentService.toggleFavorite(ad.id, ad.favorite).subscribe();

    // For now, just update the UI
    console.log(`Toggle favorite for ad ${ad.id}: ${ad.favorite}`);
  }

  // Mock data creation for development purposes
  // private createMockAdvertisments(): void {
  //   const mockAds: Advertisment[] = [
  //     {
  //       id: 1,
  //       title: 'Vaca lechera Holstein',
  //       description:
  //         'Vaca lechera Holstein de 4 años en excelente estado de salud. Produce 30 litros diarios.',
  //       price: 1200,
  //       location: { id: 1, name: 'Sevilla', language: 1 },
  //       specie: { id: 1, name: 'Vacuno', language: 1 },
  //       race: { id: 1, name: 'Holstein', language: 1, specie: 1 },
  //       language: 1,
  //       birthdate: new Date('2020-05-12'),
  //       gender: 'Hembra',
  //       state: true,
  //       create_at: new Date('2024-03-15'),
  //       image: null,
  //     },
  //     {
  //       id: 2,
  //       title: 'Toro Aberdeen Angus de pura raza',
  //       description:
  //         'Toro Aberdeen Angus de 3 años, excelente genética para reproducción y carne de alta calidad.',
  //       price: 2500,
  //       location: { id: 4, name: 'Valencia', language: 1 },
  //       specie: { id: 1, name: 'Vacuno', language: 1 },
  //       race: { id: 2, name: 'Aberdeen Angus', language: 1, specie: 1 },
  //       language: 1,
  //       birthdate: new Date('2021-06-10'),
  //       gender: 'Macho',
  //       state: true,
  //       create_at: new Date('2024-04-05'),
  //       image: null,
  //     },
  //     {
  //       id: 3,
  //       title: 'Cordero merino de alta calidad',
  //       description:
  //         'Cordero merino de 8 meses, ideal para reproducción. Lana de excelente calidad.',
  //       price: 350,
  //       location: { id: 2, name: 'Madrid', language: 1 },
  //       specie: { id: 2, name: 'Ovino', language: 1 },
  //       race: { id: 2, name: 'Merino', language: 1, specie: 2 },
  //       language: 1,
  //       birthdate: new Date('2023-10-05'),
  //       gender: 'Macho',
  //       state: true,
  //       create_at: new Date('2024-05-01'),
  //       image: null,
  //     },
  //     {
  //       id: 4,
  //       title: 'Oveja Suffolk de calidad premium',
  //       description:
  //         'Oveja Suffolk de 2 años, excelente para carne y producción lechera.',
  //       price: 400,
  //       location: { id: 5, name: 'Granada', language: 1 },
  //       specie: { id: 2, name: 'Ovino', language: 1 },
  //       race: { id: 3, name: 'Suffolk', language: 1, specie: 2 },
  //       language: 1,
  //       birthdate: new Date('2022-03-15'),
  //       gender: 'Hembra',
  //       state: true,
  //       create_at: new Date('2024-04-25'),
  //       image: null,
  //     },
  //     {
  //       id: 5,
  //       title: 'Cabra Murciano-Granadina lechera',
  //       description:
  //         'Cabra Murciano-Granadina de 3 años con alta producción láctea, ideal para queserías artesanales.',
  //       price: 280,
  //       location: { id: 6, name: 'Murcia', language: 1 },
  //       specie: { id: 3, name: 'Caprino', language: 1 },
  //       race: { id: 1, name: 'Murciano-Granadina', language: 1, specie: 3 },
  //       language: 1,
  //       birthdate: new Date('2021-02-20'),
  //       gender: 'Hembra',
  //       state: true,
  //       create_at: new Date('2024-04-10'),
  //       image: null,
  //     },
  //     {
  //       id: 6,
  //       title: 'Cerdo Ibérico de bellota',
  //       description:
  //         'Cerdo Ibérico puro de bellota de 14 meses, criado en dehesa natural.',
  //       price: 650,
  //       location: { id: 7, name: 'Badajoz', language: 1 },
  //       specie: { id: 4, name: 'Porcino', language: 1 },
  //       race: { id: 1, name: 'Ibérico', language: 1, specie: 4 },
  //       language: 1,
  //       birthdate: new Date('2023-02-10'),
  //       gender: 'Macho',
  //       state: true,
  //       create_at: new Date('2024-04-15'),
  //       image: null,
  //     },
  //     {
  //       id: 7,
  //       title: 'Gallinas ponedoras Leghorn',
  //       description:
  //         'Lote de 5 gallinas ponedoras de raza Leghorn. Producen huevos grandes a diario.',
  //       price: 75,
  //       location: { id: 3, name: 'Barcelona', language: 1 },
  //       specie: { id: 5, name: 'Avícola', language: 1 },
  //       race: { id: 5, name: 'Leghorn', language: 1, specie: 5 },
  //       language: 1,
  //       birthdate: new Date('2023-01-15'),
  //       gender: 'Hembra',
  //       state: true,
  //       create_at: new Date('2024-04-20'),
  //       image: null,
  //     },
  //     {
  //       id: 8,
  //       title: 'Caballo Pura Raza Española',
  //       description:
  //         'Caballo PRE de 5 años, domado y con excelente morfología. Ideal para doma clásica.',
  //       price: 8500,
  //       location: { id: 8, name: 'Córdoba', language: 1 },
  //       specie: { id: 6, name: 'Equino', language: 1 },
  //       race: { id: 1, name: 'Pura Raza Española', language: 1, specie: 6 },
  //       language: 1,
  //       birthdate: new Date('2019-07-20'),
  //       gender: 'Macho',
  //       state: true,
  //       create_at: new Date('2024-03-30'),
  //       image: null,
  //     },
  //   ];

  //   this.advertisments = mockAds;
  //   this.filteredAds = [...mockAds];
  //   this.loading = false;
  // }

  // Helper methods for the template
  getEspecieName(especieId: string): string {
    return this.especies.find((e) => e.id === especieId)?.name || '';
  }

  getRazaName(razaId: string): string {
    return this.razas.find((r) => r.id === razaId)?.name || '';
  }

  removeEspecie(): void {
    this.especieSeleccionada = '';
    this.razaSeleccionada = '';
    this.razasFiltradas = [];
    this.applyFilters();
  }

  removeRaza(): void {
    this.razaSeleccionada = '';
    this.applyFilters();
  }

  removeMinPrice(): void {
    this.minPrice = 0;
    this.isMinPriceActive = false;
    this.updateSliderTrack();
    this.applyFilters();
  }

  removeMaxPrice(): void {
    this.maxPrice = this.maxSliderValue;
    this.isMaxPriceActive = false;
    this.updateSliderTrack();
    this.applyFilters();
  }

  removeSearchTerm(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Métodos para controlar el slider de precio
  onMinSliderChange(): void {
    // Si el valor mínimo es mayor que el máximo, ajustamos el valor máximo
    if (this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice;
    }

    // Activar flag si el valor es mayor que 0
    this.isMinPriceActive = this.minPrice > 0;
    console.log(
      `Min slider changed: ${this.minPrice}, active: ${this.isMinPriceActive}`
    );

    // Actualizar el track highlight
    this.updateSliderTrack();
  }

  onMaxSliderChange(): void {
    // Si el valor máximo es menor que el mínimo, ajustamos el valor mínimo
    if (this.maxPrice < this.minPrice) {
      this.minPrice = this.maxPrice;
    }

    // Activar/desactivar flag según el valor del slider
    this.isMaxPriceActive = this.maxPrice < this.maxSliderValue;
    console.log(
      `Max slider changed: ${this.maxPrice}, active: ${this.isMaxPriceActive}`
    );

    // Actualizar el track highlight
    this.updateSliderTrack();
  }

  // Método para actualizar el aspecto visual del track del slider
  updateSliderTrack(): void {
    const minValue = this.minPrice;
    const maxValue = this.maxPrice;

    const container = document.getElementById('priceSliderContainer');
    if (!container) return;

    // Update the fill element to show the selected range
    const fill = container.querySelector('.price-slider-fill') as HTMLElement;
    if (fill) {
      const minPercent = (minValue / this.maxSliderValue) * 100;
      const width = ((maxValue - minValue) / this.maxSliderValue) * 100;

      // Make sure percentages are valid
      const safeMinPercent = Math.max(0, Math.min(100, minPercent));
      const safeWidth = Math.max(0, Math.min(100, width));

      fill.style.left = `${safeMinPercent}%`;
      fill.style.width = `${safeWidth}%`;

      // Log for debugging
      console.log(
        `Price slider: min=${minValue}, max=${maxValue}, width=${safeWidth}%, left=${safeMinPercent}%`
      );
    }
  }
  calculateAge(birthdate: Date): string {
    if (!(birthdate instanceof Date)) {
      birthdate = new Date(birthdate);
    }
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
}
