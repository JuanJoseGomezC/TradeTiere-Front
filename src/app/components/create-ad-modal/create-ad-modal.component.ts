import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-ad-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-ad-modal.component.html',
  styleUrl: './create-ad-modal.component.css'
})
export class CreateAdModalComponent {
  @Output() closeModal = new EventEmitter<boolean>();
  adForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  categories = [
    { id: 'vacuno', name: 'Vacuno' },
    { id: 'ovino', name: 'Ovino' },
    { id: 'caprino', name: 'Caprino' },
    { id: 'porcino', name: 'Porcino' },
    { id: 'avicola', name: 'Avícola' },
    { id: 'equino', name: 'Equino' },
    { id: 'otros', name: 'Otros animales' }
  ];

  constructor(private fb: FormBuilder) {
    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      location: ['', Validators.required],
      images: [null]
    });
  }

  close() {
    this.closeModal.emit(true);
  }

  onSubmit() {
    if (this.adForm.invalid) {
      this.adForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Simular envío del formulario
    setTimeout(() => {
      this.isSubmitting = false;
      // Aquí iría la lógica para enviar los datos a través de un servicio
      console.log('Datos del anuncio:', this.adForm.value);
      this.close();
    }, 1500);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length) {
      this.adForm.patchValue({
        images: files
      });
    }
  }
}
