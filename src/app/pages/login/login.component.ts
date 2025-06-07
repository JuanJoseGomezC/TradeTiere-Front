import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    private router: Router,
    private authService: AuthService
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

    // Obtener credenciales del formulario
    const { email, password } = this.loginForm.value;
    
    console.log('LoginComponent: Intentando iniciar sesión', { email });

    // Llamar al servicio de autenticación para iniciar sesión
    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('LoginComponent: Inicio de sesión exitoso:', user);
        
        // Redirigir al usuario a la página de inicio
        this.router.navigate(['/']);
        
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('LoginComponent: Error en el inicio de sesión:', error);
        
        // Manejo de diferentes tipos de errores
        if (error.status === 401) {
          this.loginError = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
        } else {
          this.loginError = 'Error durante el inicio de sesión. Por favor, inténtalo de nuevo.';
        }
        
        this.isSubmitting = false;
      }
    });
  }

  // Getters para acceder fácilmente al estado de los campos en el template
  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }
  get emailInvalid() { return this.emailControl?.invalid && (this.emailControl?.touched || this.emailControl?.dirty); }
  get passwordInvalid() { return this.passwordControl?.invalid && (this.passwordControl?.touched || this.passwordControl?.dirty); }
}
