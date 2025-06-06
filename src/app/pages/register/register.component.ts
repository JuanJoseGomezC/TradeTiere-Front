import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  registerError = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): {[key: string]: boolean} | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.registerError = '';

    // En un caso real, aquí llamarías a tu servicio de registro
    const { name, email, phone, password } = this.registerForm.value;

    // Simulando un registro exitoso después de 1 segundo
    setTimeout(() => {
      // Aquí por ahora solo simularemos un registro exitoso
      console.log('Registro exitoso', { name, email, phone });

      // Redirigir al usuario a la página de inicio o login
      this.router.navigate(['/login']);

      this.isSubmitting = false;
    }, 1000);
  }

  // Getters para acceder fácilmente al estado de los campos en el template
  get nameControl() { return this.registerForm.get('name'); }
  get emailControl() { return this.registerForm.get('email'); }
  get phoneControl() { return this.registerForm.get('phone'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword'); }
  get termsControl() { return this.registerForm.get('termsAccepted'); }

  get nameInvalid() { return this.nameControl?.invalid && (this.nameControl?.touched || this.nameControl?.dirty); }
  get emailInvalid() { return this.emailControl?.invalid && (this.emailControl?.touched || this.emailControl?.dirty); }
  get phoneInvalid() { return this.phoneControl?.invalid && (this.phoneControl?.touched || this.phoneControl?.dirty); }
  get passwordInvalid() { return this.passwordControl?.invalid && (this.passwordControl?.touched || this.passwordControl?.dirty); }
  get confirmPasswordInvalid() {
    return (this.confirmPasswordControl?.invalid || this.registerForm.hasError('passwordMismatch')) &&
           (this.confirmPasswordControl?.touched || this.confirmPasswordControl?.dirty);
  }
  get termsInvalid() { return this.termsControl?.invalid && (this.termsControl?.touched || this.termsControl?.dirty); }
}
