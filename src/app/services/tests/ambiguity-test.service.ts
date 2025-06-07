import { Injectable } from '@angular/core';
import * as Services from '../services'; // Import all services from the barrel file

@Injectable({
  providedIn: 'root'
})
export class TestAmbiguityService {
  
  // Access the services to verify there are no import ambiguities
  constructor() {
    console.log('Services imported successfully');
  }

  testEnhancedUser(): void {
    // Create an EnhancedUser object
    const enhancedUser: Services.EnhancedUser = {
      id: 1,
      name: 'John',
      lastname: 'Doe',
      mail: 'john@example.com',
      fullName: 'John Doe',
      age: 30
    };
    console.log('Enhanced user:', enhancedUser);
  }

  testAuthUser(): void {
    // Create a User object from auth service
    const authUser: Services.User = {
      id: 1,
      name: 'Jane',
      lastname: 'Doe',
      mail: 'jane@example.com'
    };
    console.log('Auth user:', authUser);
  }
}
