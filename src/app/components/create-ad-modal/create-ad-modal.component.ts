import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// --- Imports de Angular Material ---
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdvertismentService } from '../../services/advertisment.service';
import { SpecieService, RaceService, SpecieDto, RaceDto, LocationDto, LocationService } from '../../services';

// Interfaces para tipado fuerte
interface Specie {
  id: string;
  name: string;
}
interface Race {
  id: string;
  name: string;
  specieId: string;
}
interface ImagePreview {
  name: string;
  url: string;
  file: File;
}

@Component({
  selector: 'app-create-ad-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // --- Módulos de Angular Material ---
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-ad-modal.component.html',
  styleUrl: './create-ad-modal.component.css',
})
export class CreateAdModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  adForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  locationNameControl!: FormControl;
  // --- Propiedades para UI y Lógica ---
  maxDate: Date = new Date();
  animalAge: string = '';

  // --- Lógica de Selects Dependientes ---
  species: SpecieDto[] = [];
  races: RaceDto[] = [];
  filteredRaces: RaceDto[] = [];

  readonly defaultLanguageId = 1;

  // --- Lógica de Autocompletado ---
  locations: LocationDto[] = [];
  filteredLocations!: Observable<LocationDto[]>;

  genders = ['Macho', 'Hembra'];

  imagePreview: ImagePreview | null = null;

  constructor(
    private fb: FormBuilder,
    private advertismentService: AdvertismentService,
    private specieService: SpecieService,
    private raceService: RaceService,
    private locationService: LocationService
  ) {
    this.locationNameControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.adForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1000),
        ],
      ],
      specie: ['', Validators.required],
      race: [{ value: '', disabled: true }, Validators.required],
      birthdate: [null, Validators.required],
      gender: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      location: [null, [Validators.required, Validators.min(1)]],
      language: [1, Validators.required],
    });

    this.setupDependentControls();
    this.loadSpecies();
    this.loadLocations();
  }

  private setupDependentControls(): void {
    this.adForm.get('specie')?.valueChanges.subscribe((specieId) => {
      const raceControl = this.adForm.get('race');
      raceControl?.reset('');
      if (specieId) {
        this.loadRacesBySpecie(specieId);
        raceControl?.enable();
      } else {
        this.filteredRaces = [];
        raceControl?.disable();
      }
    });

    this.adForm.get('birthdate')?.valueChanges.subscribe((date) => {
      this.animalAge = date ? this.calculateAge(new Date(date)) : '';
    });

    this.filteredLocations = this.locationNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value?.name || '')),
      map((name) => this._filterLocations(name))
    );
  }
  private _filterLocations(value: string): LocationDto[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter((loc) =>
      loc.name.toLowerCase().includes(filterValue)
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      file.type.match(/image\/(png|jpeg|jpg)/) &&
      file.size < 5 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = {
          name: file.name,
          url: e.target.result,
          file: file,
        };
      };
      reader.readAsDataURL(file);
    } else {
      console.warn(`Archivo "${file.name}" descartado por formato o tamaño.`);
    }

    event.target.value = '';
  }

  removeImage(): void {
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.adForm.invalid || !this.imagePreview) {
      this.adForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const file = this.imagePreview.file;
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];

      const dto = {
        ...this.adForm.value,
        image: {
          imageBase64: base64String,
          name: file.name,
          contentType: file.type,
        },
        state: true,
        create_at: new Date().toISOString().split('T')[0],
      };

      this.advertismentService.createAdvertisment(dto).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.close();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = 'Error al publicar el anuncio.';
          console.error(err);
        },
      });
    };

    reader.readAsDataURL(file);
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  close(): void {
    this.closeModal.emit();
  }
  onLocationSelected(location: LocationDto): void {
    this.adForm.patchValue({ location: location.id });
  }
  private loadLocations(): void {
    this.locationService.getAllEnhanced().subscribe({
      next: (locations) => {
        this.locations = locations.filter(
          (l) => l.language === this.defaultLanguageId
        );
      },
      error: (err) => console.error('Error al cargar ubicaciones', err),
    });
  }
  private loadSpecies(): void {
    this.specieService.getAllEnhanced().subscribe({
      next: (species) => {
        this.species = species.filter(
          (s) => s.language === this.defaultLanguageId
        );
      },
      error: (err) => console.error('Error al cargar especies', err),
    });
  }

  private loadRacesBySpecie(specieId: number): void {
    this.raceService.getRacesBySpecie(specieId).subscribe({
      next: (races) => {
        this.filteredRaces = races.filter(
          (r) => r.language === this.defaultLanguageId
        );
      },
      error: (err) => console.error('Error al cargar razas', err),
    });
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
}
