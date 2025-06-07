# Guía de Autenticación TradeTiere

## Flujo de Autenticación

### Inicio de Sesión

1. El usuario introduce su email y contraseña en el formulario de login.
2. El componente `LoginComponent` llama al método `login()` del servicio `AuthService`.
3. El `AuthService` crea un objeto `LoginDto` con los datos del formulario.
4. El `AuthService` llama al método `post()` del `ApiService` con el endpoint `/auth/login`.
5. Si la respuesta es exitosa:
   - Se almacena el token JWT en localStorage.
   - Se crea un objeto de usuario temporal con los datos mínimos.
   - Se llama al método `refreshUserData()` para obtener los datos completos del usuario.
   - Se actualiza el `currentUserSubject` con el usuario completo.
6. Si hay un error:
   - Se muestra un mensaje de error en el formulario de login.

### Registro

1. El usuario completa el formulario de registro.
2. El componente `RegisterComponent` llama al método `register()` del servicio `AuthService`.
3. El `AuthService` crea un objeto `RegisterDto` con los datos del formulario.
4. El `AuthService` llama al método `post()` del `ApiService` con el endpoint `/auth/register`.
5. Si la respuesta es exitosa:
   - Se almacena el token JWT en localStorage.
   - Se crea un objeto de usuario temporal con los datos mínimos.
   - Se llama al método `refreshUserData()` para obtener los datos completos del usuario.
   - Se actualiza el `currentUserSubject` con el usuario completo.
6. Si hay un error:
   - Se muestra un mensaje de error en el formulario de registro.

## Pasos para depurar problemas de autenticación

1. **Verificar las credenciales**
   - Asegurarse de que el email y la contraseña son correctos.
   - Revisar que el email esté registrado en el sistema.

2. **Verificar la respuesta del servidor**
   - Revisar la consola del navegador para ver los logs de las peticiones HTTP.
   - Verificar que el servidor está respondiendo con un token válido.

3. **Verificar el almacenamiento local**
   - Comprobar que el token JWT se está almacenando correctamente en localStorage.
   - Verificar que los datos del usuario se están almacenando correctamente en localStorage.

4. **Verificar el manejo de errores**
   - Revisar los logs de errores en la consola del navegador.
   - Comprobar que los errores se están manejando adecuadamente.

5. **Verificar la configuración CORS**
   - Asegurarse de que el servidor tiene configurado correctamente los encabezados CORS.
   - Revisar los errores CORS en la consola del navegador.

6. **Verificar la comunicación con el backend**
   - Probar el endpoint de login con una herramienta como Postman.
   - Verificar que el backend está respondiendo correctamente.

## Errores comunes y soluciones

### Error 401 (Unauthorized)
- **Problema**: Credenciales incorrectas
- **Solución**: Verificar que el email y la contraseña son correctos.

### Error 400 (Bad Request)
- **Problema**: Datos de autenticación mal formados
- **Solución**: Verificar que el formato de los datos enviados coincide con lo que espera el backend.

### Error CORS
- **Problema**: El backend no permite peticiones desde el frontend
- **Solución**: Configurar correctamente los encabezados CORS en el backend.

### Error de red
- **Problema**: No se puede conectar con el servidor
- **Solución**: Verificar que el servidor está en ejecución y accesible.
