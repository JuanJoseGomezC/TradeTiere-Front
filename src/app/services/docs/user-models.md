# User Models in TradeTiere Application

This document explains the two different user models in the application and how they are used.

## Overview

The TradeTiere application has two distinct user models that serve different purposes:

1. **User** - From `auth.service.ts` - Used for authentication and basic user identity
2. **EnhancedUser** - From `user.service.ts` - Extended user model with additional UI/frontend properties

## User Interface (auth.service.ts)

The `User` interface defined in the authentication service represents the core user identity used primarily for authentication flows:

```typescript
export interface User {
  id: number;
  name: string;
  lastname: string;
  mail: string;
  birthday?: Date;
  createAt?: Date;
  phone?: string;
  profileImage?: string;
  joinDate?: Date;
}
```

This model:
- Is returned after login/registration
- Represents the authenticated user
- Contains basic user properties needed for most operations
- Is stored in local storage on successful authentication

## EnhancedUser Interface (user.service.ts)

The `EnhancedUser` interface extends the base `UserDto` interface and adds frontend-specific properties:

```typescript
export interface EnhancedUser extends UserDto {
  fullName?: string;
  age?: number;
  formattedJoinDate?: string;
  profileImageUrl?: string;
}
```

This model:
- Is used for profile display and user management operations
- Contains calculated/derived properties like age and formatted dates
- Provides display-friendly versions of user properties
- Is created by transforming API data with UI-specific enhancements

## Usage Guidelines

1. **For Authentication**: Use the `User` interface from `auth.service.ts`
2. **For Profile Display**: Use the `EnhancedUser` interface from `user.service.ts`
3. **For API Communication**: Use the `UserDto` interface for API requests/responses
4. **For User Updates**: Use the `UpdateUserDto` interface

## When to Use Each

- Use `User` when working with login, registration, and authentication flows
- Use `EnhancedUser` when displaying user profiles or user-related UI
- Use `UserDto` when directly communicating with the API
- Use `UpdateUserDto` when updating user information

## Importing

To avoid naming conflicts when importing both interfaces, use named imports:

```typescript
import { User as AuthUser } from './auth.service';
import { EnhancedUser } from './user.service';
```

Or import from the barrel file:

```typescript
import { User, EnhancedUser } from '../services';
```

## Example Usage

Here's how to use these interfaces in your components:

```typescript
// In a component that handles authentication:
import { Component } from '@angular/core';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-login',
  //...
})
export class LoginComponent {
  currentUser: User | null = null;
  
  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }
  
  login(email: string, password: string): void {
    this.authService.login(email, password).subscribe(
      (user: User) => {
        console.log('Logged in user:', user.name);
      }
    );
  }
}

// In a component that displays user profile:
import { Component, OnInit } from '@angular/core';
import { UserService, EnhancedUser } from '../services/user.service';

@Component({
  selector: 'app-profile',
  //...
})
export class ProfileComponent implements OnInit {
  userProfile: EnhancedUser | null = null;
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.userService.getUserEnhanced(1).subscribe(
      (enhancedUser: EnhancedUser) => {
        this.userProfile = enhancedUser;
        console.log('User age:', enhancedUser.age);
        console.log('Formatted join date:', enhancedUser.formattedJoinDate);
      }
    );
  }
}
```

## Flow Between Models

1. API returns `UserDto` objects
2. `UserService.enhanceUser` transforms `UserDto` into `EnhancedUser` with additional properties
3. Components receive `EnhancedUser` objects ready for UI display
