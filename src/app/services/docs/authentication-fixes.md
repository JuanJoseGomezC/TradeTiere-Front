# Correcciones en el Sistema de Autenticación

Este documento detalla las correcciones implementadas para resolver los problemas con la autenticación y la persistencia de la sesión del usuario en la aplicación TradeTiere.

## Problemas Resueltos

1. **Persistencia incorrecta del token** - El token se guardaba correctamente en localStorage, pero no se actualizaba el estado del usuario en toda la aplicación.

2. **Sesión no restaurada correctamente** - Al recargar la página, el usuario aparecía como no autenticado aunque el token seguía siendo válido.

3. **Fallo en componente de Perfil** - El perfil mostraba "no autenticado" incluso cuando el usuario había iniciado sesión correctamente.

## Soluciones Implementadas

### 1. Mejora en AuthService

- **Corrección del flujo de autenticación**: Se mejoró el flujo completo desde login/registro hasta la obtención de datos del usuario.

```typescript
login(email: string, password: string): Observable<User> {
  const loginDto: LoginDto = { mail: email, password };
  
  return this.apiService.post<TokenDto>('/auth/login', loginDto).pipe(
    tap(response => {
      // Almacenar token
      localStorage.setItem(this.tokenKey, response.token);
      
      // Establecer fecha de expiración
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      localStorage.setItem('session_expiration', expirationDate.toISOString());
      
      // Usuario temporal mientras se obtienen los datos completos
      const dummyUser: User = {
        id: 0, // Se actualizará con los datos reales
        mail: email,
        name: '',
        lastname: ''
      };
      
      localStorage.setItem('current_user', JSON.stringify(dummyUser));
      this.currentUserSubject.next(dummyUser);
    }),
    switchMap(() => this.refreshUserData()), // Obtener datos completos automáticamente
    catchError(error => {
      // Manejo de errores mejorado
      if (error.status === 401) {
        return throwError(() => new Error('Credenciales inválidas'));
      }
      return throwError(() => new Error('Error durante el inicio de sesión'));
    })
  );
}
```

- **Verificación de expiración de sesión**: Implementación de un sistema para verificar si la sesión ha expirado.

```typescript
private loadUserFromStorage() {
  const token = localStorage.getItem(this.tokenKey);
  const userJson = localStorage.getItem('current_user');
  const sessionExpiration = localStorage.getItem('session_expiration');

  if (token && userJson) {
    try {
      // Verificar si la sesión ha expirado
      if (sessionExpiration && new Date(sessionExpiration) < new Date()) {
        this.logout();
        return;
      }

      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
      
      // Refrescar datos en segundo plano
      this.refreshUserData().subscribe({
        next: () => console.log('Datos actualizados'),
        error: (err) => console.error('Error:', err)
      });
    } catch (e) {
      this.logout();
    }
  }
}
```

### 2. Mejora en el Componente de Perfil

- **Verificación proactiva del estado de autenticación**: Comprobación explícita del estado de autenticación antes de intentar cargar datos.

```typescript
ngOnInit(): void {
  this.isLoading = true;
  
  // Verificar autenticación
  if (!this.authService.isLoggedIn) {
    this.router.navigate(['/login']);
    return;
  }
  
  // Intentar refrescar los datos primero
  this.authService.refreshUserData().pipe(
    catchError(error => {
      // Usar datos en caché si hay error
      return of(this.authService.getCurrentUser());
    }),
    switchMap(user => {
      const currentUser = user || this.authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        this.loadingError = 'No se pudo cargar el perfil';
        this.isLoading = false;
        return of(null);
      }
      
      // Cargar perfil con ID actualizado
      return this.profileService.getProfile(currentUser.id);
    })
  ).subscribe(/* ... */);
}
```

### 3. Mecanismo de Renovación de Sesión

Se implementó un mecanismo para renovar automáticamente la sesión sin necesidad de volver a iniciar sesión:

```typescript
renewSession(): void {
  if (!this.isLoggedIn) return;
  
  // Extender período de sesión
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  localStorage.setItem('session_expiration', expirationDate.toISOString());
}
```

## Beneficios de los Cambios

1. **Persistencia de sesión robusta**: El usuario permanecerá autenticado entre recargas de página o en nuevas visitas mientras su sesión sea válida.

2. **Mayor seguridad**: Implementación de expiración de sesión para evitar que una sesión permanezca válida indefinidamente.

3. **Experiencia de usuario mejorada**: No es necesario iniciar sesión en cada navegación o recarga.

4. **Mejor manejo de errores**: Mensajes de error claros y específicos para diferentes situaciones.

## Próximas mejoras recomendadas

- Implementar un interceptor HTTP para manejar errores 401 globalmente
- Añadir un mecanismo de renovación automática de tokens
- Mejorar la sincronización entre pestañas/ventanas del navegador
- Implementar cierre de sesión automático por inactividad
