# TradeTiere

TFG tienda venta animales

---

## Índice

1. [Introducción](#introducción)
2. [Análisis DAFO](#análisis-dafo)
3. [Objetivos](#objetivos)
4. [Metodología](#metodología)
5. [Fases del Proyecto](#fases-del-proyecto)
6. [Temporización](#temporización)
7. [Medios y Recursos](#medios-y-recursos)
8. [Tecnologías Usadas](#tecnologías-usadas)
9. [Presupuesto](#presupuesto)
10. [Arquitectura General](#arquitectura-general)
11. [Frontend](#frontend)
12. [Backend](#backend)
13. [Base de Datos](#base-de-datos)
14. [Alojamiento y Seguridad](#alojamiento-y-seguridad)
15. [Pruebas Generales](#pruebas-generales)
16. [Mejoras Futuras](#mejoras-futuras)
17. [Conclusiones](#conclusiones)
18. [Bibliografía](#bibliografía)
19. [Anexos](#anexos)

---

## Introducción

TradeTiere es una plataforma web orientada a la digitalización del sector ganadero, permitiendo la compraventa de animales de granja de forma segura, eficiente y transparente. Nace de la necesidad de modernizar un sector tradicionalmente basado en el trato presencial, ofreciendo un entorno digital centralizado donde vendedores y compradores pueden interactuar, publicar anuncios, gestionar ofertas y realizar transacciones bajo un marco de seguridad y cumplimiento normativo.

El proyecto está dividido en dos partes principales:
- **Backend**: Desarrollado en Java con Spring Boot, expone una API RESTful, gestiona la lógica de negocio, la seguridad y la persistencia de datos en PostgreSQL.
- **Frontend**: Construido en Angular, proporciona una SPA (Single Page Application) moderna, responsiva y fácil de usar, conectada al backend mediante HTTP y JWT.

TradeTiere apuesta por la usabilidad, la escalabilidad y la seguridad, integrando buenas prácticas de desarrollo y tecnologías actuales. El modelo de negocio se basa en la monetización por anuncios y comisiones, con vistas a una futura expansión internacional y la integración de servicios adicionales (veterinaria, transporte, seguros, etc.).

---

## Análisis DAFO

**Debilidades**
- Dependencia de una conexión a internet estable para el uso óptimo de la plataforma.
- Necesidad de moderación y control de calidad del contenido publicado por los usuarios.
- Falta de contenido inicial (anuncios y usuarios reales) en el lanzamiento.
- Requiere formación básica en tecnología para usuarios menos digitalizados.

**Amenazas**
- Barreras legales y normativas sobre la compraventa de animales según la región.
- Desconfianza inicial de los usuarios hacia las plataformas digitales.
- Posible entrada de grandes competidores generalistas (Wallapop, Milanuncios).
- Riesgo de mal uso de la plataforma (anuncios ilegales, fraude).

**Fortalezas**
- Plataforma especializada en un nicho poco explotado: compraventa de animales de granja.
- Base de datos relacional sólida y escalable.
- Uso de tecnologías modernas (Angular, Spring Boot, PostgreSQL).
- Diseño multiplataforma adaptable a distintos dispositivos.
- Posibilidad de multilingüismo e implementación por regiones.

**Oportunidades**
- Digitalización progresiva del sector agropecuario.
- Escasa competencia directa especializada en este tipo de compraventa.
- Facilidad para integrar servicios adicionales (veterinaria, transporte, seguros).
- Potencial de expansión a nivel nacional e internacional.

---

## Objetivos

- Crear una plataforma web robusta y segura para la compraventa de animales de granja.
- Establecer una marca confiable y reconocida en el sector agropecuario digital.
- Desarrollar una interfaz intuitiva y accesible para usuarios con distintos niveles de experiencia digital.
- Garantizar la seguridad y privacidad de los datos mediante buenas prácticas y protocolos de protección.
- Optimizar la gestión y escalabilidad de la base de datos, permitiendo un alto volumen de publicaciones y usuarios.
- Facilitar la publicación y visualización de anuncios, con herramientas de búsqueda filtrada, favoritos y mensajería directa.
- Mejorar la experiencia del usuario con una interfaz clara, tiempos de carga rápidos y navegación fluida.
- Ampliar progresivamente la oferta de especies y razas disponibles, adaptadas a cada región.
- Fomentar la sostenibilidad y el comercio responsable, promoviendo buenas prácticas y el cumplimiento legal.
- Sentar las bases para una futura expansión internacional, con soporte multilingüe y multimoneda.

---

## Metodología

El desarrollo de TradeTiere se ha basado en una metodología ágil, permitiendo una adaptación continua a los cambios y una mejora progresiva del producto. Se han utilizado sprints semanales para organizar el trabajo, priorizar tareas y revisar avances.

Las herramientas principales para la gestión del proyecto han sido:
- **Trello:** Para la organización de tareas, seguimiento del progreso y asignación de responsabilidades.
- **Git y GitHub:** Para el control de versiones, trabajo colaborativo y gestión de incidencias.
- **Reuniones periódicas:** Para la revisión de objetivos, resolución de bloqueos y toma de decisiones técnicas.

Esta metodología ha permitido una comunicación fluida, una rápida detección de problemas y una entrega incremental de funcionalidades, asegurando la calidad y la alineación con los objetivos del proyecto.

---

## Fases del Proyecto

1. **Análisis y planificación:**  
   - Estudio del problema y definición de requisitos funcionales y no funcionales.
   - Investigación del sector ganadero y análisis de plataformas similares.
   - Definición del modelo de negocio (publicidad y comisiones).
   - Diseño preliminar del modelo de datos (ERD) y estructura de entidades.

2. **Diseño del sistema:**  
   - Diseño detallado de la base de datos en PostgreSQL.
   - Estructuración de relaciones, normalización y definición de claves.
   - Bocetos de la interfaz y prototipos de pantallas clave.
   - Elección de tecnologías y herramientas definitivas.

3. **Desarrollo backend (API REST):**  
   - Implementación del backend en Spring Boot.
   - Creación de controladores, servicios y repositorios.
   - Gestión de la seguridad básica (JWT, cifrado de contraseñas).
   - Conexión con la base de datos (PostgreSQL).
   - Pruebas unitarias de endpoints.

4. **Desarrollo frontend:**  
   - Implementación de la interfaz con Angular.
   - Conexión con la API REST.
   - Desarrollo de funcionalidades: login, registro, publicación, búsqueda, contacto.
   - Diseño responsivo y pruebas en distintos navegadores.

5. **Integración y pruebas:**  
   - Pruebas funcionales completas del sistema.
   - Revisión de flujos de navegación, validaciones y formularios.
   - Solución de errores y mejora de la experiencia de usuario.
   - Verificación del rendimiento y de la base de datos.

6. **Documentación y entrega final:**  
   - Redacción de la memoria del proyecto.
   - Preparación de la presentación.
   - Documentación técnica del código, base de datos y arquitectura.
   - Backup del proyecto y despliegue local o en servidor de pruebas.

---

## Temporización

La planificación temporal del proyecto se ha estructurado en función de las fases descritas, distribuyendo el trabajo a lo largo de tres meses:

| Fase                               | Fechas estimadas         |
|------------------------------------|-------------------------|
| Análisis y planificación           | 15 - 22 de marzo        |
| Diseño del sistema                 | 23 de marzo - 5 de abril|
| Desarrollo backend                 | 6 - 25 de abril         |
| Desarrollo frontend                | 26 de abril - 15 de mayo|
| Integración y pruebas              | 16 - 31 de mayo         |
| Documentación y entrega final      | 1 - 15 de junio         |

Cada fase incluye revisiones y entregables parciales, permitiendo una evaluación continua del avance y la calidad del proyecto.

---

## Medios y Recursos

### Recursos Humanos
- **Desarrollador Full Stack:** Responsable del análisis, diseño, desarrollo y pruebas tanto del backend como del frontend.
- **Tutor del proyecto:** Supervisión, orientación técnica y validación de entregables.

### Recursos Materiales
- **Hardware:**  
  - Ordenador personal con procesador Intel i5 o superior, 8GB de RAM, 256GB SSD.
  - Acceso a conexión a Internet de banda ancha.
- **Software:**  
  - Sistema operativo Windows 10/11.
  - Visual Studio Code (editor de código).
  - IntelliJ IDEA Community (IDE para Java/Spring Boot).
  - Node.js y Angular CLI.
  - PostgreSQL (gestor de base de datos).
  - DBeaver (administrador de bases de datos).
  - Postman (pruebas de API).
  - Git y GitHub (control de versiones).
  - Trello (gestión de tareas).
  - Navegadores web (Chrome, Firefox, Edge) para pruebas.

### Recursos Online
- Documentación oficial de Angular, Spring Boot, PostgreSQL.
- Tutoriales, foros y comunidades de desarrollo.
- Servicios de hosting gratuitos o de prueba para despliegue temporal.

---

## Tecnologías Usadas

### Frontend
- **Angular:** Framework SPA para el desarrollo de la interfaz de usuario.
- **HTML5 y CSS3:** Estructura y estilos de la aplicación.
- **Bootstrap:** Framework CSS para diseño responsivo.
- **TypeScript:** Lenguaje principal del frontend.
- **Jasmine/Karma:** Herramientas para pruebas unitarias en Angular.

### Backend
- **Spring Boot:** Framework Java para el desarrollo de la API REST.
- **Spring Security:** Gestión de autenticación y autorización (JWT).
- **PostgreSQL:** Sistema de gestión de bases de datos relacional.
- **Maven:** Gestión de dependencias y construcción del proyecto.
- **JUnit:** Pruebas unitarias en Java.

### Herramientas de Desarrollo
- **Visual Studio Code:** Edición de código frontend.
- **IntelliJ IDEA:** Desarrollo backend.
- **DBeaver:** Administración de la base de datos.
- **Postman:** Pruebas de endpoints REST.
- **Git y GitHub:** Control de versiones y colaboración.
- **Trello:** Organización y seguimiento de tareas.

---

## Presupuesto

### Recursos Humanos

| Concepto                  | Horas estimadas | Coste/hora (€) | Total (€) |
|---------------------------|-----------------|---------------|-----------|
| Análisis y diseño         | 40              | 20            | 800       |
| Desarrollo backend        | 80              | 20            | 1.600     |
| Desarrollo frontend       | 80              | 20            | 1.600     |
| Pruebas e integración     | 30              | 20            | 600       |
| Documentación             | 20              | 20            | 400       |
| **Total recursos humanos**| **250**         |               | **5.000** |

### Recursos Materiales y Software

| Concepto                         | Licencia/mes | Meses | Total (€) |
|----------------------------------|--------------|-------|-----------|
| Ordenador personal (amortización)| 50           | 3     | 150       |
| Licencias software (IDE, etc.)   | 0            | 3     | 0         |
| Hosting/despliegue (pruebas)     | 10           | 3     | 30        |
| Dominio web (opcional)           | 12           | 1     | 12        |
| **Total materiales/software**    |              |       | **192**   |

### Otros Gastos

| Concepto                  | Total (€) |
|---------------------------|-----------|
| Formación y documentación | 50        |
| Gastos imprevistos        | 100       |
| **Total otros gastos**    | **150**   |

### Resumen del Presupuesto

| Concepto                  | Total (€) |
|---------------------------|-----------|
| Recursos humanos          | 5.000     |
| Materiales y software     | 192       |
| Otros gastos              | 150       |
| **TOTAL**                 | **5.342** |

> **Nota:** Este presupuesto es orientativo y se basa en tarifas estándar para proyectos de desarrollo web. El uso de software open source y recursos gratuitos permite reducir costes significativamente.

---

## Arquitectura General

TradeTiere está basado en una arquitectura cliente-servidor moderna, desacoplada y escalable, que facilita el mantenimiento, la evolución y la integración de nuevas funcionalidades.  
La comunicación entre el frontend y el backend se realiza mediante una API RESTful, utilizando el formato JSON para el intercambio de datos.

### Esquema General

```
[ Usuario ]
    |
    v
[ Frontend Angular SPA ]
    |
    v
[ API REST - Spring Boot ]
    |
    v
[ PostgreSQL ]
```

- **Frontend:** Aplicación Angular (SPA) que se ejecuta en el navegador del usuario. Gestiona la interfaz, la navegación, la autenticación y la comunicación con la API.
- **Backend:** API REST desarrollada en Spring Boot. Expone endpoints para todas las operaciones de negocio, gestiona la seguridad, la lógica y la persistencia.
- **Base de datos:** PostgreSQL almacena toda la información estructurada (usuarios, anuncios, especies, razas, ubicaciones, historial de compras, etc.).

### Seguridad

- **Autenticación:** Basada en JWT (JSON Web Token). El usuario obtiene un token al iniciar sesión, que debe incluir en cada petición protegida.
- **Autorización:** Roles de usuario (usuario, administrador) gestionados desde el backend.
- **Cifrado:** Contraseñas almacenadas cifradas (BCrypt).
- **Comunicación:** Uso de HTTPS recomendado para proteger los datos en tránsito.

### Despliegue

- **Frontend:** Puede desplegarse en cualquier servidor web estático (por ejemplo, Netlify, Vercel, GitHub Pages, o un servidor propio).
- **Backend:** Desplegable en servidores cloud, VPS o localmente para pruebas.
- **Base de datos:** PostgreSQL alojado localmente o en la nube (Heroku, Clever Cloud, etc.).

---

## Frontend

### Descripción General

El frontend de TradeTiere está desarrollado con Angular, siguiendo una arquitectura modular y escalable. Se ha priorizado la experiencia de usuario, la mantenibilidad y la integración visual mediante Angular Material y estilos personalizados. La aplicación es una SPA (Single Page Application) que consume la API REST del backend y gestiona la autenticación mediante JWT.

### Estructura Real del Proyecto

La estructura de carpetas implementada es la siguiente:

```
front-TradeTiere/
├── src/
│   ├── app/
│   │   ├── components/           # Componentes reutilizables y modales (navbar, footer, edit-ad-modal, etc.)
│   │   ├── pages/                # Páginas principales (home, advertisment, profile, public-profile, login, register)
│   │   ├── services/             # Servicios para comunicación con la API y lógica de negocio (user, advertisment, location, etc.)
│   │   ├── models/               # Interfaces y modelos de datos (advertisement, user, etc.)
│   │   └── app.module.ts         # Módulo principal de la aplicación
│   ├── assets/                   # Imágenes, estilos globales, favicon
│   └── environments/             # Configuración de entornos (dev, prod)
├── angular.json                  # Configuración del proyecto Angular
└── package.json                  # Dependencias y scripts
```

### Componentes y Páginas

- **HomeComponent:** Página de inicio, muestra anuncios destacados, favoritos y acceso rápido a funcionalidades.
- **AdvertismentComponent:** Detalle de anuncio, visualización de información, imágenes, vendedor y gestión de favoritos.
- **ProfileComponent:** Perfil privado del usuario, gestión de anuncios propios, edición y visualización de fecha de registro.
- **PublicProfileComponent:** Perfil público de otros usuarios, muestra sus anuncios y datos básicos.
- **EditAdModalComponent:** Modal para edición de anuncios, con formularios reactivos, selector de ubicación, cambio de imagen y previsualización.
- **LoginComponent/RegisterComponent:** Formularios de autenticación y registro.

### Servicios

- **AdvertismentService:** CRUD de anuncios, gestión de favoritos, subida de imágenes y lógica de negocio asociada.
- **UserService:** Gestión de usuarios, perfiles y fechas de registro.
- **LocationService:** Obtención y gestión de ubicaciones.
- **AuthService:** Autenticación, registro, persistencia de sesión y gestión de JWT.
- **Otros servicios:** Para especies, razas, historial de compras, internacionalización, etc.

### Integración Visual y Experiencia de Usuario

- **Angular Material:** Se utiliza para modales, formularios, botones, selectores y otros elementos UI, garantizando una experiencia moderna y accesible.
- **Estilos personalizados:** CSS y Bootstrap para adaptar la identidad visual y la responsividad.
- **Gestión de imágenes:** Subida y previsualización de imágenes en anuncios, con validaciones y feedback visual.
- **Favoritos persistentes:** Sincronización de favoritos entre Home y detalle de anuncio, almacenados en backend y frontend.
- **Edición de anuncios:** Modal avanzado con validaciones, selectores y feedback inmediato.
- **Visualización de fechas:** Se muestra la fecha de registro del usuario y la antigüedad del perfil en los lugares relevantes.
- **Limpieza visual:** Eliminación de elementos innecesarios (mensajes, iconos, fotos de perfil en anuncios) para una interfaz clara y profesional.

### Gestión de Estado y Seguridad

- **Autenticación JWT:** El token se almacena en localStorage y se añade automáticamente a las peticiones protegidas mediante interceptores.
- **Guards de rutas:** Protección de rutas privadas y de administración.
- **Expiración de sesión:** Redirección automática al login si el token es inválido o caduca.

### Buenas Prácticas y Mantenibilidad

- **Componentes desacoplados y reutilizables.**
- **Servicios centralizados para la lógica de negocio y acceso a la API.**
- **Formularios reactivos con validaciones avanzadas.**
- **Gestión de errores y mensajes amigables al usuario.**
- **Código documentado y estructurado.**
- **Pruebas manuales y unitarias en componentes y servicios clave.**

### Resumen

El frontend de TradeTiere destaca por su enfoque en la experiencia de usuario, la claridad visual y la robustez técnica. La integración de Angular Material, la gestión avanzada de anuncios y perfiles, y la sincronización de favoritos son puntos clave que diferencian la plataforma. La estructura modular y las buenas prácticas aplicadas facilitan la evolución y el mantenimiento del proyecto.

---

## Backend

### Descripción General

El backend de TradeTiere está desarrollado en **Java** utilizando el framework **Spring Boot**, que facilita la creación de aplicaciones web robustas y escalables. Expone una **API RESTful** que gestiona toda la lógica de negocio, la autenticación/autorización y la persistencia de datos en **PostgreSQL**.

El backend está estructurado en capas siguiendo el patrón MVC (Modelo-Vista-Controlador), lo que permite separar la lógica de presentación, negocio y acceso a datos, facilitando el mantenimiento y la escalabilidad.

### Estructura de Carpetas

```
TradeTiere/
├── src/
│   ├── main/
│   │   ├── java/com/tradetierre/
│   │   │   ├── controller/      # Controladores REST
│   │   │   ├── service/         # Lógica de negocio
│   │   │   ├── model/           # Entidades JPA (User, Advertisment, Specie, etc.)
│   │   │   ├── repository/      # Interfaces de acceso a datos (Spring Data JPA)
│   │   │   ├── security/        # Configuración de seguridad (JWT, filtros, etc.)
│   │   │   └── exception/       # Manejo de errores personalizados
│   │   └── resources/
│   │       ├── application.properties # Configuración de la aplicación
│   │       └── static/                # Archivos estáticos (si aplica)
└── pom.xml                            # Dependencias Maven
```

### Controladores

Los controladores (`controller/`) exponen los endpoints REST y gestionan las peticiones HTTP. Cada entidad principal tiene su propio controlador:

- **UserController:** Registro, login, gestión de perfil, roles.
- **AdvertismentController:** CRUD de anuncios.
- **SpecieController:** CRUD de especies.
- **RaceController:** CRUD de razas.
- **LocationController:** CRUD de ubicaciones.
- **PurchaseHistoryController:** Historial de compras.

**Ejemplo de endpoint en UserController:**

```java
@PostMapping("/register")
public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {
    UserDTO createdUser = userService.register(userDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
}
```

### Servicios

La capa de servicios (`service/`) contiene la lógica de negocio y orquesta las operaciones entre los controladores y los repositorios.

- **UserService:** Registro, login, gestión de usuarios y roles, cifrado de contraseñas.
- **AdvertismentService:** Gestión de anuncios, validaciones, lógica de negocio.
- **SpecieService, RaceService, LocationService:** Gestión de entidades auxiliares.
- **PurchaseHistoryService:** Registro y consulta de compras.

### Seguridad

La seguridad se implementa con **Spring Security** y **JWT**:

- **Autenticación:** Al iniciar sesión, el usuario recibe un JWT que debe incluir en las cabeceras de las peticiones protegidas.
- **Autorización:** Los endpoints sensibles requieren roles específicos (usuario, admin).
- **Cifrado:** Contraseñas almacenadas con BCrypt.
- **Filtros:** Filtros de seguridad para validar el token en cada petición.

**Ejemplo de configuración de seguridad:**

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeRequests()
        .antMatchers("/api/v1/user/login", "/api/v1/user/register").permitAll()
        .antMatchers("/api/v1/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated()
        .and()
        .addFilter(new JwtAuthenticationFilter(authenticationManager()))
        .addFilter(new JwtAuthorizationFilter(authenticationManager()));
}
```

### Endpoints REST

**Principales endpoints:**

- `/api/v1/user/register` (POST): Registro de usuario.
- `/api/v1/user/login` (POST): Autenticación y obtención de JWT.
- `/api/v1/user/profile` (GET/PUT): Consulta y actualización de perfil.
- `/api/v1/advertisment` (GET/POST/PUT/DELETE): CRUD de anuncios.
- `/api/v1/specie` (GET/POST/PUT/DELETE): CRUD de especies.
- `/api/v1/race` (GET/POST/PUT/DELETE): CRUD de razas.
- `/api/v1/location` (GET/POST/PUT/DELETE): CRUD de ubicaciones.
- `/api/v1/purchase-history` (GET/POST): Consulta y registro de compras.

**Ejemplo de endpoint de anuncios:**

```java
@GetMapping
public List<AdvertismentDTO> getAllAdvertisments() {
    return advertismentService.getAllAdvertisments();
}
```

### Pruebas de Backend

- **Pruebas unitarias:** Uso de JUnit y Mockito para probar servicios y lógica de negocio.
- **Pruebas de integración:** Uso de Postman para validar los endpoints REST.
- **Pruebas de seguridad:** Verificación de acceso a endpoints según roles y validez del JWT.
- **Pruebas de rendimiento:** Simulación de múltiples peticiones concurrentes.

### Arquitectura y Patrones de Diseño

- **MVC (Modelo-Vista-Controlador):** Separación de lógica de presentación, negocio y acceso a datos.
- **DTO (Data Transfer Object):** Transferencia de datos entre frontend y backend.
- **Repository Pattern:** Acceso a datos con Spring Data JPA.
- **Service Layer Pattern:** Lógica de negocio centralizada en servicios.

### Ejemplo de Entidad y DTO

**Entidad JPA: User**

```java
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private String role;
    private String phone;
    private Boolean enabled;
    @OneToMany(mappedBy = "user")
    private List<Advertisment> advertisments;
    // Getters, setters, constructores
}
```

**DTO: UserDTO**

```java
public class UserDTO {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String role;
    private String phone;
    // No se expone la contraseña
    // Getters, setters, constructores
}
```

### Ejemplo de Repositorio

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### Ejemplo de Servicio

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public UserDTO register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new CustomException("El email ya está registrado");
        }
        User user = new User();
        user.setName(userDTO.getName());
        user.setSurname(userDTO.getSurname());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole("USER");
        user.setEnabled(true);
        userRepository.save(user);
        return toDTO(user);
    }
    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        return dto;
    }
}
```

### Gestión de Errores y Excepciones

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<Map<String, String>> handleCustomException(CustomException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Error interno del servidor");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

### Seguridad: JWT y Configuración de Spring Security

**Generación y validación de JWT:**

```java
@Component
public class JwtUtil {
    private final String SECRET_KEY = "_secreta";
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .claim("role", userDetails.getAuthorities().iterator().next().getAuthority())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
            .compact();
    }
    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY)
            .parseClaimsJws(token).getBody().getSubject();
    }
    // Otros métodos para validar token, extraer claims, etc.
}
```

**Configuración de Spring Security:**

```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/v1/user/login", "/api/v1/user/register").permitAll()
            .antMatchers("/api/v1/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
```

### Documentación de la API con Swagger (OpenAPI)

**Swagger** es una herramienta estándar para documentar APIs REST. Permite generar una interfaz web interactiva donde los desarrolladores pueden consultar y probar los endpoints de la API sin necesidad de herramientas externas como Postman.

#### Integración de Swagger en Spring Boot

1. **Dependencia Maven:**

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.7.0</version>
</dependency>
```

2. **Configuración básica:**

Con Springdoc OpenAPI, la documentación estará disponible en:

```
http://localhost:8080/swagger-ui.html
```
o
```
http://localhost:8080/swagger-ui/index.html
```

3. **Anotaciones en los controladores:**

```java
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    @Operation(summary = "Registrar un nuevo usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario ya existente")
    })
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.register(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
}
```

---

## Base de Datos

### Modelo Entidad-Relación (ERD)

La base de datos de TradeTiere está diseñada en **PostgreSQL** y sigue un modelo relacional, asegurando integridad, escalabilidad y eficiencia en las operaciones. El modelo entidad-relación (ERD) refleja las principales entidades del dominio y sus relaciones.

#### Entidades principales

- **User**: Usuarios registrados (ganaderos, compradores, administradores).
- **Advertisment**: Anuncios de compraventa de animales.
- **Specie**: Especies animales (vaca, cerdo, oveja, etc.).
- **Race**: Razas asociadas a cada especie.
- **Location**: Ubicaciones geográficas (provincia, región, país).
- **PurchaseHistory**: Historial de compras realizadas.
- **Language**: Idiomas soportados.
- **Image**: Imágenes asociadas a anuncios.

#### Relaciones clave

- Un **User** puede publicar varios **Advertisment**.
- Un **Advertisment** pertenece a una **Specie**, una **Race** y una **Location**.
- Un **Advertisment** puede tener varias **Image**.
- Un **User** puede tener varios **PurchaseHistory** (compras realizadas).
- **Race** está relacionada con **Specie** (una especie tiene varias razas).

#### Diagrama ERD (descripción textual)

```
User (id) 1---N Advertisment (id)
User (id) 1---N PurchaseHistory (id)
Advertisment (id) N---1 Specie (id)
Advertisment (id) N---1 Race (id)
Advertisment (id) N---1 Location (id)
Advertisment (id) 1---N Image (id)
Race (id) N---1 Specie (id)
```

### Tablas y Relaciones

#### Tabla: user

```sql
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- Ej: USER, ADMIN
    phone VARCHAR(20),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enabled BOOLEAN DEFAULT TRUE
);
```

#### Tabla: specie

```sql
CREATE TABLE specie (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
```

#### Tabla: race

```sql
CREATE TABLE race (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specie_id INTEGER REFERENCES specie(id)
);
```

#### Tabla: location

```sql
CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    province VARCHAR(100)
);
```

#### Tabla: advertisment

```sql
CREATE TABLE advertisment (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES "user"(id),
    specie_id INTEGER REFERENCES specie(id),
    race_id INTEGER REFERENCES race(id),
    location_id INTEGER REFERENCES location(id),
    status VARCHAR(20) DEFAULT 'ACTIVE' -- ACTIVE, SOLD, INACTIVE
);
```

#### Tabla: image

```sql
CREATE TABLE image (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    advertisment_id INTEGER REFERENCES advertisment(id)
);
```

#### Tabla: purchase_history

```sql
CREATE TABLE purchase_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    advertisment_id INTEGER REFERENCES advertisment(id),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price NUMERIC(10,2) NOT NULL
);
```

#### Tabla: language

```sql
CREATE TABLE language (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL, -- Ej: 'es', 'en'
    name VARCHAR(50) NOT NULL
);
```

### Consultas Personalizadas (Custom Queries)

#### Buscar anuncios por especie y rango de precio

```java
@Query("SELECT a FROM Advertisment a WHERE a.specie.id = :specieId AND a.price BETWEEN :min AND :max AND a.status = 'ACTIVE'")
List<Advertisment> searchBySpecieAndPrice(
    @Param("specieId") Long specieId,
    @Param("min") BigDecimal min,
    @Param("max") BigDecimal max
);
```

#### Buscar anuncios por ubicación y especie

```java
@Query("SELECT a FROM Advertisment a WHERE a.location.id = :locationId AND a.specie.id = :specieId AND a.status = 'ACTIVE'")
List<Advertisment> findByLocationAndSpecie(
    @Param("locationId") Long locationId,
    @Param("specieId") Long specieId
);
```

#### Buscar usuarios registrados en un rango de fechas

```java
@Query("SELECT u FROM User u WHERE u.registrationDate BETWEEN :start AND :end")
List<User> findUsersRegisteredBetween(
    @Param("start") LocalDateTime start,
    @Param("end") LocalDateTime end
);
```

#### Contar anuncios activos por especie

```java
@Query("SELECT a.specie.name, COUNT(a) FROM Advertisment a WHERE a.status = 'ACTIVE' GROUP BY a.specie.name")
List<Object[]> countActiveBySpecie();
```

#### Buscar historial de compras de un usuario

```java
@Query("SELECT ph FROM PurchaseHistory ph WHERE ph.user.id = :userId ORDER BY ph.purchaseDate DESC")
List<PurchaseHistory> findByUserIdOrderByPurchaseDateDesc(@Param("userId") Long userId);
```

---

## Alojamiento y Seguridad

### Alojamiento

Actualmente, TradeTiere **no está alojado en producción**. Todo el desarrollo, pruebas y uso de la aplicación se realiza de forma local en los equipos de desarrollo.

- **Backend (Spring Boot + PostgreSQL):**
  - El backend se ejecuta localmente usando herramientas como IntelliJ IDEA o VS Code.
  - La base de datos PostgreSQL se instala y gestiona localmente o mediante Docker.
  - No hay despliegue en servidores cloud ni VPS.
  - La configuración de la base de datos y la aplicación se realiza en el archivo `application.properties`.

- **Frontend (Angular):**
  - El frontend se ejecuta localmente con Angular CLI (`ng serve`).
  - No se realiza despliegue en servidores web ni servicios de hosting.

### Seguridad

- **Autenticación y Autorización:**
  - Uso de **JWT (JSON Web Token)** para autenticar usuarios y proteger endpoints sensibles.
  - Roles de usuario (USER, ADMIN) gestionados en la base de datos y validados en cada petición.
  - Endpoints públicos (login, registro) y privados (gestión de anuncios, compras, administración).
- **Cifrado de Contraseñas:**
  - Las contraseñas de los usuarios se almacenan cifradas con **BCrypt**.
- **Protección contra ataques comunes:**
  - **CSRF:** Deshabilitado en APIs REST, ya que el frontend y backend están desacoplados y se usa JWT.
  - **XSS y SQL Injection:**
    - Validación y saneamiento de entradas en el backend.
    - Uso de JPA/Hibernate para evitar inyecciones SQL.
    - Filtros y validaciones en el frontend para evitar scripts maliciosos.
- **Gestión de errores y logs:**
  - Manejo centralizado de excepciones para evitar la exposición de información sensible.
  - Logs de acceso y errores para auditoría y detección de incidentes.

- **Alojamiento (Frontend)**

- El frontend de TradeTiere está desarrollado en Angular y actualmente **no está desplegado en producción**.
- El desarrollo y las pruebas se realizan localmente usando Angular CLI (`ng serve`).
- No se utiliza ningún servicio de hosting ni despliegue en la nube en esta fase.
- Para producción, el frontend puede desplegarse fácilmente en cualquier servicio de hosting estático (Netlify, Vercel, GitHub Pages, Firebase Hosting, o un servidor propio), generando los archivos estáticos con `ng build --prod`.
- La configuración de entornos (`environment.ts` y `environment.prod.ts`) permite adaptar la URL de la API y otros parámetros según el entorno.

- **Seguridad (Frontend)**

- **Autenticación y Autorización:**
  - El frontend gestiona la autenticación mediante JWT, almacenando el token en `localStorage` de forma segura.
  - Se utilizan guards (`AuthGuard`, `AdminGuard`) para proteger rutas privadas y de administración.
  - El token se añade automáticamente a las peticiones HTTP mediante un interceptor.
  - Si el token es inválido o ha expirado, el usuario es redirigido automáticamente al login.
- **Almacenamiento seguro:**
  - Solo se almacena el token JWT y los datos mínimos del usuario en el navegador.
  - No se almacenan contraseñas ni información sensible en el frontend.
- **Protección contra ataques comunes:**
  - Validaciones y saneamiento de entradas en formularios para evitar XSS.
  - El backend valida y filtra los datos recibidos, reforzando la seguridad.
- **Comunicación:**
  - En local, la comunicación es por HTTP. Para producción, se recomienda HTTPS para proteger los datos en tránsito.
- **Gestión de errores:**
  - El frontend muestra mensajes claros y amigables en caso de errores de autenticación, expiración de sesión o problemas de red.

---

## Pruebas Generales

El aseguramiento de la calidad en TradeTiere se ha realizado mediante diferentes tipos de pruebas, tanto manuales como automáticas, abarcando frontend, backend, integración y seguridad.

### Pruebas Funcionales

#### Backend
- **Pruebas unitarias:**  
  - Uso de **JUnit** y **Mockito** para probar los servicios y la lógica de negocio.
  - Ejemplo: test de registro de usuario, validación de login, creación y consulta de anuncios.
- **Pruebas de integración:**  
  - Uso de **Postman** para validar los endpoints REST.
  - Se han probado todos los endpoints principales: registro, login, CRUD de anuncios, gestión de especies, razas, ubicaciones y compras.
  - Pruebas de flujos completos: registro → login → publicación de anuncio → compra.

#### Frontend
- **Pruebas manuales:**  
  - Navegación por todas las páginas y flujos de usuario.
  - Validación de formularios (campos obligatorios, formatos, mensajes de error).
  - Pruebas de usabilidad en dispositivos móviles y escritorio.
- **Pruebas unitarias:**  
  - Uso de **Jasmine/Karma** para componentes y servicios críticos.
  - Ejemplo: test de AuthService, validación de guards, renderizado de componentes.

### Pruebas de Integración
- **Comunicación Frontend-Backend:**  
  - Verificación de la correcta integración entre Angular y la API REST.
  - Pruebas de login, registro, publicación y consulta de anuncios desde la interfaz.
  - Manejo de errores y mensajes al usuario en caso de fallos de red o validaciones.
- **Persistencia de sesión:**  
  - Comprobación de la validez y expiración del token JWT.
  - Pruebas de acceso a rutas protegidas y redirección automática al login si la sesión expira.

### Pruebas de Rendimiento
- **Carga de la base de datos:**  
  - Inserción masiva de anuncios y usuarios para comprobar la escalabilidad.
  - Medición de tiempos de respuesta de los endpoints bajo carga.
- **Simulación de usuarios concurrentes:**  
  - Uso de herramientas como **Apache JMeter** para simular múltiples usuarios accediendo simultáneamente.

### Pruebas de Seguridad
- **Acceso a endpoints protegidos:**  
  - Verificación de que solo usuarios autenticados pueden acceder a recursos privados.
  - Pruebas de acceso con diferentes roles (usuario, admin).
- **Validación de JWT:**  
  - Pruebas con tokens inválidos, expirados o manipulados para asegurar el rechazo de peticiones.
- **Pruebas de inyección y XSS:**  
  - Intentos de inyección SQL y scripts en formularios para comprobar la robustez de las validaciones.

### Pruebas de Usabilidad
- **Testing con usuarios reales:**  
  - Se han realizado sesiones de prueba con usuarios para evaluar la facilidad de uso, la navegación y la comprensión de la interfaz.
  - Recogida de feedback para mejoras en la experiencia de usuario.

### Registro y Gestión de Errores
- **Logs de backend:**  
  - Registro de errores y eventos importantes en archivos de log para su posterior análisis.
- **Gestión de errores en frontend:**  
  - Mensajes claros y amigables para el usuario final en caso de errores de validación o fallos de red.

---

## Mejoras Futuras

- Filtros avanzados de búsqueda.
- Sistema de mensajería interna.
- Notificaciones en tiempo real.
- Valoraciones y reputación.
- Pasarela de pago integrada.
- Internacionalización completa.
- App móvil nativa.
- Panel de administración avanzado.
- Auditoría y trazabilidad.
- Cumplimiento RGPD.
- Monitorización y alertas.

---

## Conclusiones

El desarrollo de TradeTiere ha supuesto un reto técnico y organizativo, permitiendo aplicar y consolidar conocimientos en arquitectura de software, desarrollo full stack, seguridad y gestión de proyectos.  
La plataforma responde a una necesidad real del sector agropecuario, aportando digitalización, eficiencia y transparencia a la compraventa de animales de granja.

Durante el proyecto se han superado desafíos como la integración de tecnologías modernas (Angular, Spring Boot, PostgreSQL), la implementación de seguridad robusta (JWT, roles, cifrado), y la creación de una experiencia de usuario intuitiva y accesible.

TradeTiere sienta las bases para una futura expansión, tanto en funcionalidades como en alcance geográfico, y demuestra la viabilidad de soluciones tecnológicas en sectores tradicionalmente poco digitalizados.  
El aprendizaje obtenido y la experiencia adquirida serán de gran valor para futuros proyectos profesionales y personales.

---

## Bibliografía

- [Documentación oficial de Angular](https://angular.io/docs)
- [Documentación oficial de Spring Boot](https://spring.io/projects/spring-boot)
- [Documentación oficial de PostgreSQL](https://www.postgresql.org/docs/)
- [Bootstrap](https://getbootstrap.com/)
- [DBeaver](https://dbeaver.io/)
- [GitHub](https://github.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Baeldung - Spring Security](https://www.baeldung.com/spring-security)
- [Baeldung - Spring Boot REST](https://www.baeldung.com/building-a-restful-web-service-with-spring-and-java-based-configuration)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Dbdiagram.io](https://dbdiagram.io/)
- [YouTube - Tutoriales de Angular y Spring Boot]
- [Foros y comunidades de Stack Overflow](https://stackoverflow.com/)
- [Trello](https://trello.com/)
- [Postman](https://www.postman.com/)

---

## Anexos

### Ejemplo de Código: Endpoint de Registro de Usuario (Spring Boot)

```java
@PostMapping("/register")
public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {
    UserDTO createdUser = userService.register(userDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
}
```

### Ejemplo de Código: Servicio de Autenticación (Angular)

```typescript
login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/user/login`, { email, password })
    .pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
}
```

### Script SQL: Creación de Tabla de Anuncios

```sql
CREATE TABLE advertisment (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES "user"(id),
    specie_id INTEGER REFERENCES specie(id),
    race_id INTEGER REFERENCES race(id),
    location_id INTEGER REFERENCES location(id),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
```

### Capturas de Pantalla

- Página principal de TradeTiere (Angular)
- Formulario de registro de usuario
- Listado de anuncios
- Panel de administración
- Pruebas de endpoints en Postman
- Modelo entidad-relación en DBeaver

*(Incluir imágenes en el documento Word final)*

### Diagrama ERD (Dbdiagram.io)

*(Adjuntar imagen o exportar el diagrama generado en la herramienta)*

### Manual de Usuario

- **Registro e inicio de sesión:**  
  Acceder a la plataforma, crear una cuenta y autenticarse.
- **Publicación de anuncios:**  
  Completar el formulario de alta de anuncio, adjuntar imágenes y seleccionar especie, raza y ubicación.
- **Búsqueda y filtrado:**  
  Utilizar los filtros para encontrar animales por especie, raza, ubicación o precio.
- **Gestión de perfil:**  
  Editar datos personales, cambiar contraseña y consultar historial de compras.
- **Administración:**  
  Acceso a funcionalidades exclusivas para administradores: gestión de usuarios, anuncios y moderación de contenido.

---
