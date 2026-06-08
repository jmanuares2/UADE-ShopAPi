# UADE Shop API

REST API de e-commerce desarrollada como Trabajo Práctico Obligatorio para la materia **Técnicas de Programación Orientada a Objetos (TPO)** — UADE, 1er cuatrimestre 2026.

## Descripción

Backend de una tienda de indumentaria que expone endpoints RESTful para gestionar productos, categorías, usuarios y el carrito de compras. Implementa autenticación stateless con JWT y control de acceso basado en roles (ADMIN / USER).

## Stack tecnológico

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 4.0.4 |
| Spring Security | (incluido en Spring Boot) |
| Maven | Wrapper incluido |
| MySQL | 8.x (vía XAMPP) |
| H2 | Solo para tests |
| Lombok | (incluido) |
| JWT | io.jsonwebtoken |

## Requisitos previos

- **JDK 17** instalado y configurado en `JAVA_HOME`
- **XAMPP** con MySQL corriendo en `localhost:3306`
- La base de datos `ecommerce_db3` se crea automáticamente al levantar la app

## Configuración

Editar `src/main/resources/application.properties` con los datos de tu entorno:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db3?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=        # vacío en XAMPP por defecto
```

## Ejecución

```bash
# Levantar la aplicación
./mvnw spring-boot:run

# Compilar (sin tests)
./mvnw clean package -DskipTests
```

La API queda disponible en `http://localhost:8080`.

Al iniciar por primera vez se cargan datos de prueba automáticamente:

| Email | Contraseña | Rol |
|---|---|---|
| admin@tienda.com | admin123 | ADMIN |
| juan@gmail.com | juan123 | USER |

---

## Endpoints

### Autenticación — `/api/auth`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registrar nuevo usuario |
| POST | `/api/auth/login` | Público | Iniciar sesión, retorna JWT |

**Registro** (`POST /api/auth/register`):
```json
{
  "nombre": "María",
  "apellido": "García",
  "nombreUsuario": "mariagarcia",
  "email": "maria@gmail.com",
  "password": "pass1234"
}
```

**Login** (`POST /api/auth/login`):
```json
{
  "email": "maria@gmail.com",
  "password": "pass1234"
}
```
Respuesta: `{ "token": "<JWT>" }`

---

### Productos — `/api/productos`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/productos` | Público | Listar todos los productos |
| GET | `/api/productos/{id}` | Público | Obtener producto por ID |
| GET | `/api/productos/categoria/{categoriaId}` | Público | Filtrar por categoría |
| POST | `/api/productos` | Autenticado | Crear producto |
| PUT | `/api/productos/{id}` | Creador o ADMIN | Actualizar producto |
| DELETE | `/api/productos/{id}` | Creador o ADMIN | Eliminar producto |

**Crear / actualizar producto**:
```json
{
  "nombre": "Remera Básica Blanca",
  "descripcion": "100% algodón",
  "precio": 15000.0,
  "stock": 30,
  "imagenUrl": "https://...",
  "talle": "M",
  "color": "Blanco",
  "categoriaId": 1
}
```

---

### Categorías — `/api/categorias`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/categorias` | Público | Listar categorías |
| GET | `/api/categorias/{id}` | Público | Obtener categoría por ID |
| POST | `/api/categorias` | ADMIN | Crear categoría |
| PUT | `/api/categorias/{id}` | ADMIN | Actualizar categoría |
| DELETE | `/api/categorias/{id}` | ADMIN | Eliminar categoría |

---

### Carrito — `/api/carrito`

Todos los endpoints requieren autenticación. El carrito se crea automáticamente al registrarse.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/carrito` | Ver mi carrito |
| POST | `/api/carrito/items` | Agregar ítem |
| DELETE | `/api/carrito/items/{itemId}` | Quitar ítem |
| DELETE | `/api/carrito/clear` | Vaciar carrito |
| POST | `/api/carrito/checkout` | Confirmar compra (descuenta stock) |

**Agregar ítem**:
```json
{
  "productoId": 1,
  "cantidad": 2
}
```

---

### Usuarios — `/api/usuarios` _(solo ADMIN)_

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/usuarios/{id}` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | Baja lógica (soft delete) |
| PATCH | `/api/usuarios/{id}/restaurar` | Restaurar usuario dado de baja |
| DELETE | `/api/usuarios/{id}/definitivo` | Eliminar físicamente |

---

## Autenticación

Incluir el token en el header de cada request protegido:

```
Authorization: Bearer <token>
```

Los tokens tienen una vigencia de **24 horas**.

---

## Arquitectura

```
com.uade.tpo.e_commerce
├── controller/     # Endpoints REST (delegan todo al service)
├── service/        # Lógica de negocio con @Transactional
├── repository/     # Interfaces Spring Data JPA
├── model/          # Entidades JPA con Lombok
├── dto/            # Objetos de transferencia (request / response)
├── security/       # JwtUtil + JwtFilter
├── config/         # SecurityConfig + DataSeedingConfig
└── exception/      # Excepciones de dominio + GlobalExceptionHandler
```

### Reglas de negocio principales

- **Roles:** `ADMIN` tiene acceso total; `USER` puede publicar productos y usar el carrito.
- **Permisos de producto:** Solo el creador o un ADMIN puede modificar o eliminar un producto (`ForbiddenOperationException`).
- **Precios:** No se permiten precios negativos (`PrecioNegativoException`).
- **Stock:** Al agregar al carrito y en el checkout se valida stock disponible (`OutOfStockException`).
- **Baja de usuarios:** Es lógica (`activo=false`); se puede restaurar. La baja definitiva es física.
- **Carrito:** Uno por usuario, creado al momento del registro.

---

## Tests

Tests de integración con JUnit 5 + Spring Boot Test + H2 en memoria. Cada test corre con rollback automático.

```bash
# Ejecutar todos los tests
./mvnw test

# Ejecutar una clase de test específica
./mvnw test -Dtest=ProductoServiceTest

# Ejecutar un método de test específico
./mvnw test -Dtest=CarritoServiceTest#testCheckoutDescontaStock
```

| Clase de test | Qué cubre |
|---|---|
| `AuthenticationServiceTest` | Registro, login, usuario duplicado |
| `CarritoServiceTest` | Validación de stock, totales, checkout |
| `ProductoServiceTest` | Precios negativos, permisos de edición |
| `UsuarioServiceSoftDeleteTest` | Baja lógica vs. baja física |

### Tests E2E (Postman / Newman)

Requiere la API corriendo en `localhost:8080`:

```bash
.\run-tests.bat
```

---

## CORS

Configurado para aceptar requests desde `http://localhost:5173` (frontend Vite/React).

---

