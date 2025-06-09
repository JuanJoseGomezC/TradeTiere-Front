import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterDto } from '../../services/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule],
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
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Resetear error al modificar el formulario
    this.registerForm.valueChanges.subscribe(() => {
      if (this.registerError) {
        this.registerError = '';
      }
    });
  }
  initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      birthdate: ['', Validators.required],
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
  }  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Validación avanzada antes de enviar
    const validationError = this.validateRegisterFields({
      mail: this.registerForm.value.email || '',
      birthdate: this.registerForm.value.birthdate || '',
      password: this.registerForm.value.password || ''
    });
    if (validationError) {
      this.registerError = validationError;
      return;
    }

    this.isSubmitting = true;
    this.registerError = '';

    // Obtener valores del formulario
    const { name, lastname, email: mail, phone, birthdate, password } = this.registerForm.value;

    // Crear objeto RegisterDto para la API
    const registerData: RegisterDto = {
      mail,
      name,
      lastname,
      password,
      birthdate: birthdate ? new Date(birthdate).toISOString() : new Date().toISOString()
    };

    console.log('RegisterComponent: Enviando datos de registro:', registerData);

    // Llamar al servicio de autenticación para registrar al usuario
    this.authService.register(registerData).subscribe({
      next: (user) => {
        console.log('RegisterComponent: Registro exitoso:', user);
        this.router.navigate(['/home']);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('RegisterComponent: Error en el registro:', error);
        if (error.status === 409) {
          this.registerError = 'El correo electrónico ya está registrado.';
        } else if (error.status === 400) {
          this.registerError = 'Datos de registro inválidos. Por favor revise los campos.';
        } else {
          this.registerError = error.message || 'Error durante el registro. Por favor, inténtelo de nuevo.';
        }
        this.isSubmitting = false;
      }
    });
  }

  validateRegisterFields({ mail, birthdate, password }: { mail: string, birthdate: string, password: string }): string | null {
    // Validar edad (mayor de 18 años)
    const birthdateObj = new Date(birthdate);
    const age = new Date().getFullYear() - birthdateObj.getFullYear();
    if (age < 18) {
      return 'Debes tener al menos 18 años para registrarte.';
    }

    // Validar contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(password)) {
      return 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.';
    }

    return null;
  }

  // Getters para acceder fácilmente al estado de los campos en el template
  get nameControl() { return this.registerForm.get('name'); }
  get lastnameControl() { return this.registerForm.get('lastname'); }
  get emailControl() { return this.registerForm.get('email'); }
  get phoneControl() { return this.registerForm.get('phone'); }
  get birthdateControl() { return this.registerForm.get('birthdate'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword'); }
  get termsControl() { return this.registerForm.get('termsAccepted'); }
  get nameInvalid() { return this.nameControl?.invalid && (this.nameControl?.touched || this.nameControl?.dirty); }
  get lastnameInvalid() { return this.lastnameControl?.invalid && (this.lastnameControl?.touched || this.lastnameControl?.dirty); }
  get emailInvalid() { return this.emailControl?.invalid && (this.emailControl?.touched || this.emailControl?.dirty); }
  get phoneInvalid() { return this.phoneControl?.invalid && (this.phoneControl?.touched || this.phoneControl?.dirty); }
  get birthdateInvalid() { return this.birthdateControl?.invalid && (this.birthdateControl?.touched || this.birthdateControl?.dirty); }
  get passwordInvalid() { return this.passwordControl?.invalid && (this.passwordControl?.touched || this.passwordControl?.dirty); }
  get confirmPasswordInvalid() {
    return (this.confirmPasswordControl?.invalid || this.registerForm.hasError('passwordMismatch')) &&
           (this.confirmPasswordControl?.touched || this.confirmPasswordControl?.dirty);
  }
  get termsInvalid() { return this.termsControl?.invalid && (this.termsControl?.touched || this.termsControl?.dirty); }
}
