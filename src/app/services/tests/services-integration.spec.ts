import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdvertismentService } from '../advertisment.service';
import { SpecieService } from '../specie.service';
import { RaceService } from '../race.service';
import { LocationService } from '../location.service';
import { LanguageService } from '../language.service';
import { PurchaseHistoryService } from '../purchase-history.service';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';

describe('Services Integration', () => {
  let httpTestingController: HttpTestingController;
  let advertismentService: AdvertismentService;
  let specieService: SpecieService;
  let raceService: RaceService;
  let locationService: LocationService;
  let languageService: LanguageService;
  let purchaseHistoryService: PurchaseHistoryService;
  let userService: UserService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        AdvertismentService,
        SpecieService,
        RaceService,
        LocationService,
        LanguageService,
        PurchaseHistoryService,
        UserService
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
    advertismentService = TestBed.inject(AdvertismentService);
    specieService = TestBed.inject(SpecieService);
    raceService = TestBed.inject(RaceService);
    locationService = TestBed.inject(LocationService);
    languageService = TestBed.inject(LanguageService);
    purchaseHistoryService = TestBed.inject(PurchaseHistoryService);
    userService = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // Sample test for Advertisment Service
  it('should get advertisments', () => {
    const mockAds = [
      {
        id: 1,
        title: 'Test Ad',
        description: 'Description',
        price: 100,
        location: 1,
        specie: 1,
        race: 1,
        language: 1,
        birthdate: '2023-01-01',
        gender: 'Male',
        state: true,
        create_at: '2023-01-15'
      }
    ];

    advertismentService.getAdvertisments().subscribe(ads => {
      expect(ads.length).toBe(1);
      expect(ads[0].title).toBe('Test Ad');
      expect(ads[0].category).toBeDefined();
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/v1/advertisment');
    expect(req.request.method).toEqual('GET');
    req.flush(mockAds);
  });

  // Sample test for Species Service
  it('should get all species', () => {
    const mockSpecies = [
      { id: 1, name: 'Vacuno', language: 1 },
      { id: 2, name: 'Ovino', language: 1 }
    ];

    specieService.getAll().subscribe(species => {
      expect(species.length).toBe(2);
      expect(species[0].name).toBe('Vacuno');
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/v1/specie');
    expect(req.request.method).toEqual('GET');
    req.flush(mockSpecies);
  });

  // Sample test for enhanced species
  it('should get enhanced species with additional properties', () => {
    const mockSpecies = [
      { id: 1, name: 'Vacuno', language: 1 }
    ];

    specieService.getAllEnhanced().subscribe(species => {
      expect(species[0].displayName).toBeDefined();
      expect(species[0].icon).toBeDefined();
      expect(species[0].categoryKey).toBe('vacuno');
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/v1/specie');
    expect(req.request.method).toEqual('GET');
    req.flush(mockSpecies);
  });

  // Sample test for enhanced user
  it('should get enhanced user with additional properties', () => {
    const mockUser = {
      id: 1,
      name: 'John',
      lastname: 'Doe',
      mail: 'john@example.com',
      birthday: '1990-01-01',
      createAt: '2023-01-15'
    };

    userService.getUserEnhanced(1).subscribe(user => {
      expect(user.fullName).toBeDefined();
      expect(user.age).toBeDefined();
      expect(user.formattedJoinDate).toBeDefined();
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/v1/user/1');
    expect(req.request.method).toEqual('GET');
    req.flush(mockUser);
  });

  // Add more tests for other services as needed
});
