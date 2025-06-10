import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

// Import all our services
import { SpecieService } from './specie.service';
import { RaceService } from './race.service';
import { LocationService } from './location.service';
import { LanguageService } from './language.service';
import { PurchaseHistoryService } from './purchase-history.service';
import { UserService } from './user.service';
import { AdvertismentService } from './advertisment.service';

/**
 * Example service that demonstrates how all the services can be used together
 * This is for demonstration purposes only
 */
@Injectable({
  providedIn: 'root',
})
export class ExampleIntegrationService {
  constructor(
    private advertismentService: AdvertismentService,
    private specieService: SpecieService,
    private raceService: RaceService,
    private locationService: LocationService,
    private languageService: LanguageService,
    private purchaseHistoryService: PurchaseHistoryService,
    private userService: UserService
  ) {}

  /**
   * Get advertisment details with all related data
   * Demonstrates how to combine multiple service calls
   */
  getFullAdvertismentDetails(advertismentId: number): Observable<any> {
    return this.advertismentService.getAdvertismentById(advertismentId).pipe(
      switchMap((ad) => {
        if (!ad) return of(null);

        return forkJoin({
          ad: of(ad),
          specie:
            ad.specie && ad.specie.id !== undefined
              ? this.specieService.getById(ad.specie.id)
              : of(null),
          race:
            ad.race && ad.race.id !== undefined
              ? this.raceService.getById(ad.race.id)
              : of(null),
          location: ad.location
            ? this.locationService.getById(ad.location)
            : of(null),
          language: ad.language
            ? this.languageService.getById(ad.language)
            : of(null),
          seller: ad.sellerId
            ? this.userService.getById(ad.sellerId)
            : of(null),
        }).pipe(
          map((result) => ({
            ...result.ad,
            specieInfo: result.specie,
            raceInfo: result.race,
            locationInfo: result.location,
            languageInfo: result.language,
            sellerInfo: result.seller,
          }))
        );
      })
    );
  }

  /**
   * Get a user's profile with all related data
   * Demonstrates how to combine multiple service calls
   */
  getUserProfile(userId: number): Observable<any> {
    return this.userService.getUserEnhanced(userId).pipe(
      switchMap((user) => {
        // Fetch all related data for this user
        return forkJoin({
          user: of(user),
          advertisments: this.userService.getUserAdvertisments(userId),
          favorites: this.userService.getUserFavorites(userId),
          purchases: this.purchaseHistoryService.findAllByMail(user.mail),
        }).pipe(
          map((result) => ({
            ...result.user,
            advertisments: result.advertisments,
            favorites: result.favorites,
            purchases: result.purchases,
          }))
        );
      })
    );
  }

  /**
   * Get all data needed for the home page
   * Demonstrates how to combine multiple service calls
   */
  getHomePageData(): Observable<any> {
    return forkJoin({
      advertisments: this.advertismentService.getAdvertisments(),
      species: this.specieService.getAll(),
      locations: this.locationService.getAllEnhanced(),
      languages: this.languageService.getAll(),
    });
  }

  /**
   * Search for advertisments with filters
   * Demonstrates how to combine multiple service calls
   */
  searchAdvertisments(filters: {
    specieId?: number;
    raceId?: number;
    locationId?: number;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }): Observable<any> {
    return this.advertismentService.getAdvertisments().pipe(
      map((ads) => {
        // Apply filters
        return ads.filter((ad) => {
          // Filter by specie
          if (filters.specieId && ad.specie?.id !== filters.specieId)
            return false;

          // Filter by race
          if (filters.raceId && ad.race?.id !== filters.raceId) return false;

          // Filter by location
          if (filters.locationId && ad.location !== filters.locationId)
            return false;

          // Filter by price range
          if (filters.minPrice && ad.price < filters.minPrice) return false;
          if (filters.maxPrice && ad.price > filters.maxPrice) return false;

          // Filter by search term
          if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            if (
              !ad.title.toLowerCase().includes(term) &&
              !ad.description.toLowerCase().includes(term)
            ) {
              return false;
            }
          }

          return true;
        });
      })
    );
  }
}
