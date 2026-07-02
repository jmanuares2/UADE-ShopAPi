# UADE Shop API

API REST de e-commerce desarrollada como Trabajo Practico Obligatorio para la materia Tecnicas de Programacion Orientada a Objetos (TPO) - UADE.

El proyecto incluye:

- Backend Spring Boot en `src/main/java/com/uade/tpo/e_commerce`
- Frontend React/Vite en `e-commerce-front`
- MySQL para ejecucion local o Docker
- H2 en memoria para tests

## Stack

| Tecnologia | Uso |
|---|---|
| Java 17 | Backend |
| Spring Boot 4.0.4 | API REST |
| Spring Security | Autenticacion y autorizacion |
| Spring Data JPA | Persistencia |
| MySQL 8 | Base de datos local/Docker |
| H2 | Tests |
| React + Vite | Frontend |
| Axios | Cliente HTTP |
| Bootstrap | Estilos del frontend |
| Redux Toolkit | Estado global (Carrito/favoritos) |
| Redux Persist | Persistencia del estado de Redux |
| JWT | Sesion stateless |

## Configuracion Local

La configuracion principal esta en:

```text
src/main/resources/application.properties
```

Por defecto apunta a MySQL local:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db3?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

Si usas XAMPP u otra instalacion, ajusta usuario, password, host, puerto o nombre de base segun corresponda.

## Ejecucion

Backend:

```bash
./mvnw spring-boot:run
```

Frontend:

```bash
cd e-commerce-front
npm install
npm run dev
```

URLs:

- API: `http://localhost:8080`
- Frontend: `http://localhost:5173`

Con Docker:

```bash
docker compose up --build
```

El `docker-compose.yml` levanta MySQL, backend y frontend.

## Datos Iniciales

Al iniciar con base vacia se cargan datos de prueba desde `DataSeedingConfig`:

| Email | Password | Rol |
|---|---|---|
| `admin@tienda.com` | `admin123` | `ADMIN` |
| `juan@gmail.com` | `juan123` | `USER` |

Tambien se crean categorias y productos iniciales.

## Autenticacion

El backend usa JWT, pero el token no se envia manualmente en `Authorization`.

Flujo actual:

1. `POST /api/auth/login` o `POST /api/auth/register`
2. El backend devuelve un `AuthResponse` y setea una cookie HttpOnly llamada `jwt`
3. El frontend envia esa cookie automaticamente con Axios usando `withCredentials: true`
4. Para requests mutantes, Spring CSRF usa la cookie `XSRF-TOKEN` y el header `X-XSRF-TOKEN`

La cookie `jwt` dura 24 horas.

Logout:

```http
POST /api/auth/logout
```

Ese endpoint borra la cookie `jwt`.

## Endpoints

### Auth - `/api/auth`

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| POST | `/api/auth/register` | Publico | Registra usuario y setea cookie JWT |
| POST | `/api/auth/login` | Publico | Inicia sesion y setea cookie JWT |
| POST | `/api/auth/logout` | Publico | Borra cookie JWT |

Registro:

```json
{
  "nombreUsuario": "mariagarcia",
  "nombre": "Maria",
  "apellido": "Garcia",
  "email": "maria@gmail.com",
  "password": "pass1234"
}
```

Login:

```json
{
  "email": "maria@gmail.com",
  "password": "pass1234"
}
```

Respuesta:

```json
{
  "userId": 1,
  "token": "<jwt>",
  "role": "USER"
}
```

El `token` tambien viene en el body por compatibilidad, pero el frontend real usa la cookie HttpOnly. El campo `role` puede tomar los valores `USER`, `ADMIN` o `VENDEDOR`.

### Productos - `/api/productos`

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| GET | `/api/productos` | Publico | Lista productos ordenados por nombre |
| GET | `/api/productos/{id}` | Publico | Obtiene producto por ID |
| GET | `/api/productos/categoria/{categoriaId}` | Publico | Lista productos por categoria |
| GET | `/api/productos/buscar?q={nombre}` | Publico | Busca productos por coincidencia de nombre |
| GET | `/api/productos/filtrar?precioMin={min}&precioMax={max}` | Publico | Filtra productos por rango de precio |
| GET | `/api/productos/mis-productos` | Vendedor o ADMIN | Lista productos del creador autenticado |
| POST | `/api/productos` | Vendedor o ADMIN | Crea producto |
| PUT | `/api/productos/{id}` | Creador o ADMIN | Actualiza producto |
| DELETE | `/api/productos/{id}` | Creador o ADMIN | Elimina producto |

Body de creacion/actualizacion:

```json
{
  "nombre": "Remera Basica Blanca",
  "descripcion": "100% algodon",
  "precio": 15000.0,
  "descuento": 10,
  "stock": 30,
  "imagenUrl": "https://...",
  "talle": "M",
  "color": "Blanco",
  "categoriaId": 1
}
```

*Nota:* El campo `descuento` es un entero opcional que representa el porcentaje de descuento (0 a 100).

### Categorias - `/api/categorias`

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| GET | `/api/categorias` | Publico | Lista categorias |
| GET | `/api/categorias/{id}` | Publico | Obtiene categoria por ID |
| POST | `/api/categorias` | ADMIN | Crea categoria |
| PUT | `/api/categorias/{id}` | ADMIN | Actualiza categoria |
| DELETE | `/api/categorias/{id}` | ADMIN | Elimina categoria sin productos |
| DELETE | `/api/categorias/{id}?reemplazoId={otroId}` | ADMIN | Reasigna productos y elimina categoria |

Regla de borrado:

- Si la categoria no tiene productos, se puede eliminar directo.
- Si tiene productos, debe enviarse `reemplazoId`.
- `reemplazoId` debe existir y ser distinto al ID eliminado.
- La reasignacion y el borrado ocurren en una misma transaccion.

Body:

```json
{
  "nombre": "Remeras"
}
```

### Carrito - `/api/carrito`

Todos los endpoints requieren usuario autenticado.

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/carrito` | Ver mi carrito |
| POST | `/api/carrito/items` | Agregar item al carrito |
| PUT | `/api/carrito/items/{itemId}?cantidad={N}` | Actualizar cantidad de un item |
| DELETE | `/api/carrito/items/{itemId}` | Quitar item del carrito |
| DELETE | `/api/carrito/clear` | Vaciar carrito |
| POST | `/api/carrito/checkout` | Confirmar compra y descontar stock |

Agregar item:

```json
{
  "productoId": 1,
  "cantidad": 2
}
```

### Favoritos - `/api/favoritos`

Todos los endpoints requieren usuario autenticado.

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/favoritos` | Lista mis productos favoritos |
| POST | `/api/favoritos/{productoId}` | Agrega producto a favoritos |
| DELETE | `/api/favoritos/{productoId}` | Quita producto de favoritos |

### Perfil - `/api/perfil`
### Reseñas - `/api/productos/{productoId}/resenas`

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| POST | `/api/productos/{productoId}/resenas` | Usuario que compró el producto | Crea una nueva reseña para un producto. |
| GET | `/api/productos/{productoId}/resenas` | Público | Obtiene todas las reseñas de un producto. |


### Perfil - `/api/perfil`
Todos los endpoints requieren usuario autenticado.

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/perfil/verificar-password` | Verifica si la contraseña actual provista es correcta |
| PUT | `/api/perfil` | Actualiza la informacion de perfil del usuario |

Verificar contraseña body:
```json
{
  "passwordActual": "pass1234"
}
```

### Historial de Compras - `/api/mis-compras`

Todos los endpoints requieren usuario autenticado.

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/mis-compras` | Obtiene el historial de compras del usuario |
| DELETE | `/api/mis-compras/{id}` | Elimina una compra específica del historial |
| DELETE | `/api/mis-compras` | Limpia todo el historial de compras del usuario |

### Usuarios - `/api/usuarios`

Todos los endpoints requieren rol `ADMIN`.

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/usuarios` | Lista usuarios |
| GET | `/api/usuarios/{id}` | Obtiene usuario por ID |
| POST | `/api/usuarios` | Crea usuario |
| PUT | `/api/usuarios/{id}` | Actualiza usuario |
| DELETE | `/api/usuarios/{id}` | Baja logica |
| PATCH | `/api/usuarios/{id}/restaurar` | Restaura usuario |
| DELETE | `/api/usuarios/{id}/definitivo` | Elimina fisicamente |

## Arquitectura Backend

```text
com.uade.tpo.e_commerce
├── controller/   Endpoints REST
├── service/      Logica de negocio y transacciones
├── repository/   Repositorios Spring Data JPA
├── model/        Entidades JPA
├── dto/          Requests y responses
├── security/     JWT, filtro JWT y CSRF
├── config/       Seguridad, CORS y datos iniciales
└── exception/    Excepciones y handler global
```

## Reglas de Negocio

- `ADMIN` puede gestionar usuarios y categorias.
- Solo los usuarios con rol `ADMIN` o `VENDEDOR` pueden gestionar (crear, actualizar o eliminar) productos.
- Solo el creador del producto o un `ADMIN` puede modificarlo o eliminarlo.
- No se permiten precios ni stocks negativos. El descuento (si se especifica) debe estar entre 0 y 100.
- El stock se valida al agregar al carrito, al actualizar cantidad y al hacer checkout.
- El checkout descuenta stock y vacia el carrito, registrando la compra en el historial.
- La baja de usuario es logica (`activo=false`).
- Un usuario dado de baja no puede autenticarse.
- Una categoria con productos solo se elimina si los productos se reasignan a otra categoria.

## Tests

Ejecutar todos los tests:

```bash
./mvnw test
```

Ejecutar una clase:

```bash
./mvnw test -Dtest=CategoriaServiceTest
```

Tests principales:

| Clase | Cubre |
|---|---|
| `AuthenticationServiceTest` | Registro, login y credenciales invalidas |
| `CarritoServiceTest` | Stock, totales y checkout |
| `ProductoServiceTest` | Precio negativo, producto inexistente y permisos |
| `UsuarioServiceSoftDeleteTest` | Baja logica y eliminacion fisica |
| `CategoriaServiceTest` | Borrado con productos y reasignacion |

## Postman / Newman

Hay una coleccion en:

```text
Pruebas_postman_collection.json
```

Y un entorno en:

```text
newman-environment.json
```

Con la API corriendo en `localhost:8080`:

```bash
.\run-tests.bat
```

## CORS

El backend acepta requests desde:

```text
http://localhost:5173
```

Esto esta configurado en `SecurityConfig`.
