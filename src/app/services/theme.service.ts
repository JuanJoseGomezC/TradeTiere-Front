import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private themeSource = new BehaviorSubject<Theme>('system');
  private isDarkModeSource = new BehaviorSubject<boolean>(this.darkModeMediaQuery.matches);

  currentTheme$ = this.themeSource.asObservable();
  isDarkMode$ = this.isDarkModeSource.asObservable();

  constructor() {
    // Inicializar desde el localStorage si existe
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      this.themeSource.next(savedTheme);
      this.updateTheme(savedTheme);
    }

    // Añadir listener para cambios en la preferencia del sistema
    this.darkModeMediaQuery.addEventListener('change', (e) => {
      if (this.themeSource.value === 'system') {
        this.isDarkModeSource.next(e.matches);
        this.applyTheme(e.matches);
      }
    });
  }

  setTheme(theme: Theme): void {
    this.themeSource.next(theme);
    localStorage.setItem('theme', theme);
    this.updateTheme(theme);
  }

  private updateTheme(theme: Theme): void {
    if (theme === 'system') {
      const isDarkMode = this.darkModeMediaQuery.matches;
      this.isDarkModeSource.next(isDarkMode);
      this.applyTheme(isDarkMode);
    } else {
      const isDarkMode = theme === 'dark';
      this.isDarkModeSource.next(isDarkMode);
      this.applyTheme(isDarkMode);
    }
  }
  private applyTheme(isDarkMode: boolean): void {
    document.documentElement.classList.toggle('dark-theme', isDarkMode);

    // Añadir la clase al body para poder seleccionar específicamente elementos en dark mode
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
  }

  toggleTheme(): void {
    const currentTheme = this.themeSource.value;
    if (currentTheme === 'light') {
      this.setTheme('dark');
    } else if (currentTheme === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }

  getCurrentThemeIcon(): string {
    const currentTheme = this.themeSource.value;
    switch (currentTheme) {
      case 'light': return 'fas fa-sun';
      case 'dark': return 'fas fa-moon';
      default: return 'fas fa-desktop';
    }
  }
}
