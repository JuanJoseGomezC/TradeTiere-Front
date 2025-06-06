import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  loginError = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginError = '';

    // En un caso real, aquí llamarías a tu servicio de autenticación
    const { email, password } = this.loginForm.value;

    // Simulando una autenticación exitosa después de 1 segundo
    setTimeout(() => {
      // Aquí por ahora solo simularemos un inicio de sesión exitoso
      console.log('Login exitoso', { email, password });

      // Redirigir al usuario a la página de inicio
      this.router.navigate(['/']);

      this.isSubmitting = false;
    }, 1000);

    // Para simular un error, descomentar esto:
    /*
    setTimeout(() => {
      this.loginError = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
      this.isSubmitting = false;
    }, 1000);
    */
  }

  // Getters para acceder fácilmente al estado de los campos en el template
  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }
  get emailInvalid() { return this.emailControl?.invalid && (this.emailControl?.touched || this.emailControl?.dirty); }
  get passwordInvalid() { return this.passwordControl?.invalid && (this.passwordControl?.touched || this.passwordControl?.dirty); }
}
