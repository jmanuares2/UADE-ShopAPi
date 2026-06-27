# Documentación de Pruebas (E-commerce)

Este documento detalla el alcance y las herramientas utilizadas para validar el funcionamiento del sistema, dividido en dos estrategias complementarias: pruebas End-to-End (E2E) y pruebas de integración de servicios.

## 1. Pruebas End-to-End (E2E) de la API REST

**Herramientas:** Postman, Newman
**Ejecución:** Archivo `run-tests.bat`
**Objetivo:** Validar los flujos principales (Happy Paths) asegurando que los controladores procesen peticiones HTTP reales y devuelvan los códigos de estado esperados (200/201). Se ejecutan sobre la base de datos de la aplicación.

La colección `Pruebas.postman_collection.json` incluye los siguientes flujos automatizados:

### Autenticación
- **Login Admin:** Ejecuta POST en `/api/auth/login`. Valida el estado 200 y almacena el token JWT devuelto en las variables de entorno de Newman para las peticiones subsecuentes.

### Categorías
- **Creación:** (POST) Verifica respuesta 201 y guarda el ID de la categoría creada.
- **Operaciones de lectura y modificación:** (GET, PUT, DELETE) Utiliza el ID guardado previamente para confirmar que el servidor resuelve las operaciones CRUD correctamente.

### Usuarios
- **Registro:** (POST) Crea un usuario de prueba y almacena su ID.
- **Gestión:** (GET, PUT, DELETE) Lee, actualiza y elimina el usuario de prueba para mantener la consistencia de los datos tras la ejecución.

### Productos
- **Creación y Listado:** (POST/GET) Crea un producto, verifica la respuesta y ejecuta llamadas a los endpoints de listado general y por categoría.
- **Modificación y Eliminación:** (PUT/DELETE) Actualiza campos específicos del producto creado y posteriormente lo elimina.

### Carrito
- **Verificación:** (GET) Obtiene el estado actual del carrito para el usuario autenticado.
- **Manipulación de Ítems:** (POST/DELETE) Añade un ítem, luego añade un segundo ítem específicamente para probar el endpoint de eliminación individual, y finalmente vacía el carrito usando `/api/carrito/clear`.
- **Checkout:** (POST) Realiza la finalización de la compra, esperando un código 200.

---

## 2. Pruebas de Integración (Capa de Servicios)

**Herramientas:** JUnit 5, Spring Boot Test, H2 Database
**Ejecución:** `mvnw test`
**Objetivo:** Validar reglas de negocio y restricciones (Sad Paths). Se ejecutan utilizando una base de datos en memoria (H2) y transacciones (`@Transactional`) para revertir el estado después de cada prueba.

La suite de pruebas en JUnit abarca las siguientes validaciones a nivel de servicio:

### AuthenticationServiceTest
- **Control de duplicados:** Valida que el registro lance `RuntimeException` si el email ya existe.
- **Credenciales inválidas:** Verifica que el intento de login con contraseña incorrecta lance `BadCredentialsException`.
- **Registro exitoso:** Confirma la inserción del nuevo usuario consultando directamente el repositorio.

### CarritoServiceTest
- **Gestión de Stock:** Asegura que intentar agregar una cantidad superior al stock disponible lance `OutOfStockException`.
- **Cálculos:** Verifica que el monto total del carrito coincida con el cálculo de cantidades por precios unitarios.
- **Proceso de Checkout:** Valida que, tras un checkout exitoso, el stock del producto disminuya correctamente en el repositorio y la lista de ítems del carrito se vacíe.
- **Checkout vacío:** Verifica que intentar pagar un carrito sin ítems lance una excepción.

### ProductoServiceTest
- **Validación de precios:** Confirma que asignar un precio negativo lance `PrecioNegativoException`.
- **Permisos de modificación:** Utilizando `@WithMockUser`, verifica que usuarios sin rol ADMIN y que no sean creadores del producto no puedan eliminarlo (`ForbiddenOperationException`).
- **Manejo de inexistentes:** Verifica que la consulta por un ID de producto que no existe devuelva `ProductoNotFoundException`.

### UsuarioServiceSoftDeleteTest
- **Baja lógica (Soft Delete):** Comprueba que la eliminación estándar cambie la bandera `activo` a `false` y asigne una `fechaBaja` sin borrar el registro físicamente.
- **Baja física (Hard Delete):** Verifica que el borrado físico remueva por completo el registro de la base de datos.
