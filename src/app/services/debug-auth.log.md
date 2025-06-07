# Registro de Depuración de Autenticación

## Flujo de Registro de Usuario

1. **Componente de Registro (`register.component.ts`)**
   - El usuario completa el formulario con:
     - Nombre
     - Apellidos
     - Email
     - Fecha de nacimiento
     - Teléfono
     - Contraseña
     - Confirmación de contraseña
     - Aceptación de términos y condiciones
   - Al hacer clic en "Crear cuenta", se llama al método `onSubmit()`
   - Se crea un objeto `RegisterDto` con los datos del formulario
   - Se llama al método `register()` del servicio de autenticación

2. **Servicio de Autenticación (`auth.service.ts`)**
   - Recibe el objeto `RegisterDto`
   - Llama al método `post()` del servicio API
   - Si la respuesta es exitosa:
     - Almacena el token JWT en localStorage
     - Crea un objeto de usuario con los datos de registro
     - Actualiza el `currentUserSubject` con el nuevo usuario
     - Devuelve el usuario
   - Si hay un error:
     - Registra el error en la consola
     - Devuelve un mensaje de error genérico

3. **Servicio API (`api.service.ts`)**
   - Construye los encabezados HTTP
   - Realiza una solicitud POST al endpoint `/auth/register`
   - Devuelve la respuesta al servicio de autenticación

## Puntos de Depuración

- **Componente de Registro**: Verificar que los datos del formulario son correctos antes de enviarlos al servicio
- **Servicio de Autenticación**: Verificar que se está haciendo la llamada correcta al API
- **Servicio API**: Verificar que la URL y los encabezados son correctos

## Solución de Problemas Comunes

1. **Error de CORS**: Verificar que el servidor backend tiene configurados correctamente los encabezados CORS
2. **Error 400 (Bad Request)**: Verificar que el formato de los datos enviados coincide con lo que espera el backend
3. **Error 409 (Conflict)**: Email ya registrado en el sistema
4. **Error de red**: Verificar que el servidor backend está en ejecución y accesible

## Pruebas

Para probar el flujo de registro, intenta registrar un usuario con los siguientes datos:

```json
{
  "name": "Usuario",
  "lastname": "De Prueba",
  "mail": "usuario@example.com",
  "birthdate": "2000-01-01T00:00:00.000Z",
  "password": "password123"
}
```

Y verifica en la consola del navegador que se están realizando las llamadas correctas.
