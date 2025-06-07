# TradeTiere API Services Implementation

This document outlines the services implemented for interacting with the TradeTiere API based on the Swagger specification.

## Service Overview

The following services have been implemented:

1. **ApiService** - Base service for all API calls with authentication handling
2. **AuthService** - Handles user authentication (login, registration, token management)
3. **AdvertisementService** - Manages animal advertisements (CRUD operations)
4. **SpecieService** - Manages animal species data
5. **RaceService** - Manages animal races/breeds data
6. **LocationService** - Manages location data
7. **LanguageService** - Manages language preferences and translations
8. **PurchaseHistoryService** - Manages purchase history records
9. **UserService** - Manages user data and operations

## Service Architecture

Each service follows a consistent pattern:

1. **API DTOs** - Interface definitions matching the API's data transfer objects
2. **Frontend Models** - Enhanced interfaces with additional UI-specific properties
3. **CRUD Operations** - Methods for creating, reading, updating, and deleting resources
4. **Data Enhancement** - Methods to transform API DTOs to frontend models with additional properties

## Key Features

### Token-Based Authentication
- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Session management and token refresh

### Data Transformation
- Conversion between API DTOs and frontend models
- Enrichment of API data with additional UI properties
- Age calculation, date formatting, and other data transformations

### Error Handling
- Consistent error handling patterns
- Automatic logout on authentication errors
- Descriptive error messages

## Naming Conventions

- **DTO interfaces** - Named with the `Dto` suffix (e.g., `AdvertisementDto`)
- **Frontend models** - Named without suffix (e.g., `Advertisement`)
- **Update DTOs** - Named with the `UpdateXxxDto` pattern (e.g., `UpdateUserDto`)

## User Models

The application uses two different user models:

1. **User** - From `auth.service.ts` - Basic user model for authentication
2. **EnhancedUser** - From `user.service.ts` - Extended user model with UI-specific properties

See [User Models Documentation](./docs/user-models.md) for more details and [User Models Diagram](./docs/user-models-diagram.md) for a visual representation.

## Future Improvements

- Implement caching for frequently accessed data
- Add comprehensive error handling and logging
- Implement offline support with IndexedDB
- Add real-time updates with WebSockets or Server-Sent Events
- Implement Pagination for large data sets

## Testing

Unit tests have been implemented for all services. Run tests with:

```
npm test
```
