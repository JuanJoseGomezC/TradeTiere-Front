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
  templateUrl: './edit-ad-modal.component.html',
  styleUrl: './edit-ad-modal.component.css'
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
