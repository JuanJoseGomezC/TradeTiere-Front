# Persistencia de Sesión en TradeTiere

Este documento explica cómo se maneja la persistencia de sesión en la aplicación TradeTiere.

## Funcionamiento

La aplicación utiliza varios mecanismos para mantener la sesión del usuario activa:

### 1. Almacenamiento Local

Los datos de la sesión se almacenan en el `localStorage` del navegador, lo que permite que persistan incluso después de cerrar y volver a abrir el navegador. Los elementos que se almacenan son:

- `auth_token`: El token JWT de autenticación.
- `current_user`: Los datos del usuario en formato JSON.
- `session_expiration`: La fecha de expiración de la sesión en formato ISO.

### 2. Restauración de Sesión

Cuando la aplicación se inicia, el `AuthService` verifica si hay datos de sesión en el `localStorage` y si la sesión no ha expirado. Si es así, restaura automáticamente la sesión sin necesidad de que el usuario vuelva a iniciar sesión.

### 3. Renovación de Sesión

La sesión se renueva automáticamente cuando:

- El usuario interactúa con la aplicación (hace clic, presiona teclas, desplaza la página).
- La aplicación detecta actividad del usuario cada 5 minutos.

### 4. Expiración de Sesión

La sesión expira después de un período de inactividad (por defecto, 7 días). Cuando esto ocurre, el usuario debe volver a iniciar sesión.

## Diagrama de Flujo

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Inicio App   │────▶│  Verificar    │────▶│ ¿Hay sesión   │ No  ┌───────────────┐
└───────────────┘     │  localStorage  │     │  válida?     │────▶│  Mostrar      │
                      └───────────────┘     └───────┬───────┘     │  Login        │
                                                    │             └───────────────┘
                                                   Sí
                                                    ▼
                                          ┌───────────────┐
                                          │  Restaurar    │
                                          │  Sesión       │
                                          └───────┬───────┘
                                                  │
                                                  ▼
                                          ┌───────────────┐
                                          │  Usuario      │
                                          │  Autenticado  │
                                          └───────────────┘
```

## Cómo se Mantiene la Sesión

1. **Inicio de Sesión**: Cuando un usuario inicia sesión, se guarda el token, los datos del usuario y la fecha de expiración en `localStorage`.

2. **Actividad del Usuario**: Cada vez que el usuario interactúa con la aplicación, se actualiza un timestamp de última actividad.

3. **Verificación Periódica**: Cada 5 minutos, la aplicación verifica si ha habido actividad reciente. Si la hay, renueva la sesión.

4. **Renovación de Sesión**: La renovación consiste en extender la fecha de expiración por otros 7 días.

5. **Expiración**: Si la fecha actual es posterior a la fecha de expiración almacenada, la sesión se considera expirada y se cierra automáticamente.

## Consideraciones de Seguridad

- El token JWT tiene su propia fecha de expiración (gestionada por el backend).
- La fecha de expiración en el cliente es una capa adicional para cerrar sesiones inactivas.
- Los datos sensibles no se almacenan en `localStorage` para evitar exposición.

## Pasos para Depuración

Si hay problemas con la persistencia de sesión:

1. Verificar el contenido de `localStorage` en las herramientas de desarrollo del navegador.
2. Comprobar que la fecha de expiración almacenada es válida y futura.
3. Verificar que el token JWT no está expirado o no es válido.
4. Comprobar los logs en la consola para mensajes relacionados con la autenticación.
