import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateAdModalComponent } from './components/create-ad-modal/create-ad-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, CreateAdModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'front-TradeTiere';
  showCreateAdModal = false;

  constructor() {}

  ngOnInit() {
    // Inicialización del componente
  }

  openCreateAdModal() {
    this.showCreateAdModal = true;
    document.body.classList.add('modal-open');
  }

  closeCreateAdModal() {
    this.showCreateAdModal = false;
    document.body.classList.remove('modal-open');
  }
}
