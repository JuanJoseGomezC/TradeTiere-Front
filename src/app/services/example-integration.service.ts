import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

// Import all our services
import { AdvertisementService } from './advertisement.service';
import { SpecieService } from './specie.service';
import { RaceService } from './race.service';
import { LocationService } from './location.service';
import { LanguageService } from './language.service';
import { PurchaseHistoryService } from './purchase-history.service';
import { UserService } from './user.service';

/**
 * Example service that demonstrates how all the services can be used together
 * This is for demonstration purposes only
 */
@Injectable({
  providedIn: 'root'
})
export class ExampleIntegrationService {

  constructor(
    private advertisementService: AdvertisementService,
    private specieService: SpecieService,
    private raceService: RaceService,
    private locationService: LocationService,
    private languageService: LanguageService,
    private purchaseHistoryService: PurchaseHistoryService,
    private userService: UserService
  ) { }

  /**
   * Get advertisement details with all related data
   * Demonstrates how to combine multiple service calls
   */
  getFullAdvertisementDetails(advertisementId: number): Observable<any> {
    return this.advertisementService.getAdvertisementById(advertisementId).pipe(
      switchMap(ad => {
        if (!ad) return of(null);

        // Fetch all related data for this advertisement
        return forkJoin({
          ad: of(ad),
          specie: this.specieService.getById(ad.specie),
          race: this.raceService.getById(ad.race),
          location: this.locationService.getById(ad.location),
          language: this.languageService.getById(ad.language),
          seller: ad.sellerId ? this.userService.getById(ad.sellerId) : of(null)
        }).pipe(
          map(result => ({
            ...result.ad,
            specieInfo: result.specie,
            raceInfo: result.race,
            locationInfo: result.location,
            languageInfo: result.language,
            sellerInfo: result.seller
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
      switchMap(user => {
        // Fetch all related data for this user
        return forkJoin({
          user: of(user),
          advertisements: this.userService.getUserAdvertisements(userId),
          favorites: this.userService.getUserFavorites(userId),
          purchases: this.purchaseHistoryService.findAllByMail(user.mail)
        }).pipe(
          map(result => ({
            ...result.user,
            advertisements: result.advertisements,
            favorites: result.favorites,
            purchases: result.purchases
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
      advertisements: this.advertisementService.getAdvertisements(),
      species: this.specieService.getAllEnhanced(),
      locations: this.locationService.getAllEnhanced(),
      languages: this.languageService.getAll()
    });
  }

  /**
   * Search for advertisements with filters
   * Demonstrates how to combine multiple service calls
   */
  searchAdvertisements(filters: {
    specieId?: number;
    raceId?: number;
    locationId?: number;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }): Observable<any> {
    return this.advertisementService.getAdvertisements().pipe(
      map(ads => {
        // Apply filters
        return ads.filter(ad => {
          // Filter by specie
          if (filters.specieId && ad.specie !== filters.specieId) return false;

          // Filter by race
          if (filters.raceId && ad.race !== filters.raceId) return false;

          // Filter by location
          if (filters.locationId && ad.location !== filters.locationId) return false;

          // Filter by price range
          if (filters.minPrice && ad.price < filters.minPrice) return false;
          if (filters.maxPrice && ad.price > filters.maxPrice) return false;

          // Filter by search term
          if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            if (!ad.title.toLowerCase().includes(term) &&
                !ad.description.toLowerCase().includes(term)) {
              return false;
            }
          }

          return true;
        });
      })
    );
  }
}
