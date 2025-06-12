import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { LocationService, LocationDto } from '../../services/location.service';

@Component({
  selector: 'app-edit-ad-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Editar anuncio</h2>
          <button type="button" class="close-button" (click)="close()">&times;</button>
        </div>
        <form (ngSubmit)="submit()" *ngIf="adCopy">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Título</mat-label>
            <input matInput [(ngModel)]="adCopy.title" name="title" required minlength="3" maxlength="100" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea matInput [(ngModel)]="adCopy.description" name="description" required minlength="10" maxlength="1000"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Precio</mat-label>
            <input matInput type="number" [(ngModel)]="adCopy.price" name="price" required min="1" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Género</mat-label>
            <mat-select [(ngModel)]="adCopy.gender" name="gender">
              <mat-option value="Macho">Macho</mat-option>
              <mat-option value="Hembra">Hembra</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Fecha de nacimiento</mat-label>
            <input matInput [matDatepicker]="birthdatePicker" [(ngModel)]="adCopy.birthdate" name="birthdate" required />
            <mat-datepicker-toggle matSuffix [for]="birthdatePicker"></mat-datepicker-toggle>
            <mat-datepicker #birthdatePicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Ubicación</mat-label>
            <mat-select [(ngModel)]="adCopy.location" name="location" required>
              <mat-option *ngFor="let loc of locations" [value]="loc.id">{{ loc.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="image-upload-group">
            <label>Imagen actual:</label>
            <img *ngIf="imagePreview" [src]="imagePreview" alt="Imagen actual" class="image-preview" />
            <input type="file" accept="image/*" (change)="onImageSelected($event)" />
          </div>
          <div class="form-actions">
            <button mat-stroked-button color="warn" type="button" (click)="close()" class="action-cancel">
              <mat-icon>cancel</mat-icon>
              <span>Cancelar</span>
            </button>
            <button mat-raised-button color="primary" type="submit" class="action-save">
              <mat-icon>check_circle</mat-icon>
              <span>Guardar cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-container { background: #fff; border-radius: 10px; padding: 2rem; min-width: 350px; max-width: 95vw; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .close-button { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    .form-actions button { min-width: 150px; font-size: 1rem; font-weight: 600; letter-spacing: 0.5px; }
    .form-actions mat-icon { margin-right: 0.5rem; vertical-align: middle; }
    .full-width { width: 100%; }
    .image-preview { margin-top: 1rem; }
    .image-preview img { max-width: 100%; height: auto; border-radius: 8px; }
    .image-upload-group { margin-top: 1rem; }
    .image-upload-group label { display: block; margin-bottom: 0.5rem; }
    .image-upload-group img { max-width: 100px; height: auto; border-radius: 8px; margin-bottom: 0.5rem; }
  `]
})
export class EditAdModalComponent implements OnInit {
  @Input() ad: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() adUpdated = new EventEmitter<any>();

  adCopy: any = {};
  locations: LocationDto[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.adCopy = { ...this.ad };
    this.loadLocations();
    if (this.adCopy.image?.imageBase64 && this.adCopy.image?.contentType) {
      this.imagePreview = `data:${this.adCopy.image.contentType};base64,${this.adCopy.image.imageBase64}`;
    }
  }

  loadLocations() {
    this.locationService.getAll().subscribe((locs) => {
      this.locations = locs;
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        // Extraer base64 puro
        const base64 = e.target.result.split(',')[1];
        this.adCopy.image = {
          imageBase64: base64,
          name: file.name,
          contentType: file.type
        };
      };
      reader.readAsDataURL(file);
    }
  }

  close() {
    this.closeModal.emit();
  }

  submit() {
    // Asegurar que la ubicación es el objeto correcto
    const loc = this.locations.find(l => l.id == this.adCopy.location?.id || l.id == this.adCopy.location);
    if (loc) this.adCopy.location = loc;
    this.adUpdated.emit(this.adCopy);
    this.close();
  }
}
