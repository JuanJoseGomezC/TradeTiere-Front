// app.component.ts
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateAdModalComponent } from './components/create-ad-modal/create-ad-modal.component';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, CreateAdModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'front-TradeTiere';
  showCreateAdModal = false;
  private lastActivity: number = Date.now();
  private readonly ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
  private activityCheckTimer: any;

  // Nuevas propiedades para manejar el estado de autenticación
  isAuthenticated = false;
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar el estado de autenticación
    this.isAuthenticated = authService.isLoggedIn;
  }

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      console.log('Estado de autenticación:', isAuth);
    });

    // Iniciar verificación periódica de actividad del usuario
    this.startActivityCheck();
  }

  /**
   * Inicia la verificación periódica de actividad del usuario
   * Si el usuario está activo, renueva la sesión
   */
  private startActivityCheck(): void {
    this.activityCheckTimer = setInterval(() => {
      const now = Date.now();
      // Si ha habido actividad en los últimos 5 minutos y el usuario está logueado
      if (now - this.lastActivity < this.ACTIVITY_CHECK_INTERVAL && this.authService.isLoggedIn) {
        this.authService.renewSession();
      }
    }, this.ACTIVITY_CHECK_INTERVAL);
  }

  /**
   * Detecta la actividad del usuario (clicks, teclas, etc.)
   */
  @HostListener('document:click')
  @HostListener('document:keypress')
  @HostListener('document:scroll')
  onUserActivity() {
    this.lastActivity = Date.now();
  }

  openCreateAdModal() {
    this.showCreateAdModal = true;
    document.body.classList.add('modal-open');
  }

  closeCreateAdModal() {
    this.showCreateAdModal = false;
    document.body.classList.remove('modal-open');
  }

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /**
   * Limpia los recursos cuando el componente se destruye
   */
  ngOnDestroy() {
    if (this.activityCheckTimer) {
      clearInterval(this.activityCheckTimer);
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
