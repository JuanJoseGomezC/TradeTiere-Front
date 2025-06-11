import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdvertismentService, Advertisment } from '../../services/advertisment.service';
import { UserService } from '../../services/user.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.css',
})
export class PublicProfileComponent implements OnInit {
  userId: number | null = null;
  userName: string = '';
  userJoinDate: string = '';
  userProfileImage: string = '';
  ads: Advertisment[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private advertismentService: AdvertismentService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.userId) {
      this.error = 'Usuario no encontrado';
      this.loading = false;
      return;
    }
    this.userService.getUserEnhanced(this.userId).pipe(
      catchError(() => of({ fullName: 'Usuario desconocido', formattedJoinDate: '', profileImageUrl: '' }))
    ).subscribe(user => {
      this.userName = user.fullName || 'Usuario desconocido';
      this.userJoinDate = user.formattedJoinDate || '';
      this.userProfileImage = user.profileImageUrl || 'assets/images/default-profile.png';
    });
    this.advertismentService.getAdvertisments().subscribe({
      next: (ads) => {
        this.ads = ads.filter(ad => ad.userId === this.userId);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los anuncios.';
        this.loading = false;
      }
    });
  }

  viewAd(adId: number) {
    this.router.navigate(['/advertisment', adId]);
  }
}
// No hay alert en este archivo.
