# Changelog - 25 de Junio de 2026

A continuación se detalla todo el trabajo realizado en el proyecto, organizado por actualizaciones.

## 🛡️ Refactor de Seguridad, Cookies y Migración a Axios

**Archivos Editados:**
- Backend: `SecurityConfig.java`, `AuthenticationController.java`, `JwtFilter.java`, `CsrfCookieFilter.java`
- Frontend: `api.js`, `categoriaService.js`, `usuarioService.js`, `favoritesSlice.js`, `AuthContext.jsx`, `Login.jsx`, `Register.jsx`, `ProductCard.jsx`, `ProductList.jsx`, `ProductDetail.jsx`, `Carrito.jsx`, `ProductForm.jsx`, `AdminProductList.jsx`, `AdminCategorias.jsx`

### 🔐 Seguridad y Backend
- **Migración a `HttpOnly` Cookies**: Se eliminó el uso de `localStorage` para guardar el JWT en el frontend. Ahora la autenticación genera una cookie `jwt` con `HttpOnly=true` y `secure=true`, previniendo de raíz posibles ataques XSS (robo de tokens mediante inyección de scripts).
- **Protección CSRF (Double Submit Cookie)**: Se implementó un repositorio de tokens CSRF (`CookieCsrfTokenRepository.withHttpOnlyFalse()`). El backend envía un `XSRF-TOKEN` que el frontend debe reenviar como Header en operaciones sensibles (POST, PUT, DELETE) para probar que las peticiones nacen verdaderamente de nuestra aplicación.
- **Stateless Backend**: Se configuró `SessionCreationPolicy.STATELESS` para evitar la emisión de `JSESSIONID`, dejando toda la responsabilidad de sesión estrictamente en el JWT y el token CSRF.

### 🚀 Frontend y Deuda Técnica
- **Migración Integral a Axios**: Se abandonó la API nativa `fetch` en favor de `axios`. Esto profesionalizó la capa de servicios al centralizar las peticiones y limpiar drásticamente el código (se eliminó la repetición manual de `.json()` y validaciones de `response.ok` en todo el proyecto).
- **Soporte Nativo de CORS y CSRF**: Al configurar la instancia global de Axios con `withCredentials: true` y `withXSRFToken: true`, el frontend logró inyectar exitosamente y de forma automatizada las cookies de seguridad sin usar envoltorios o interceptores manuales para evadir las restricciones cross-origin.
- **Refactorización Masiva**: Se reescribieron y limpiaron alrededor de 12 archivos clave para que consuman la nueva API cliente unificada de Axios.
- **Corrección de Mapeo en Redux (`favoritesSlice`)**: Se solucionó un bug severo ("pantalla en blanco") provocado por un falso objeto `FavoritoDTO` en el mapeo de Redux; ahora consume directamente la `List<Producto>` brindada por el backend.

---

## 🛠️ Administración y UX

A continuación se detalla el trabajo realizado para conectar el frontend con los endpoints administrativos y mejorar la experiencia de usuario general.

**Archivos Editados:**
- Frontend: `AdminCategorias.jsx`, `AdminUsuarios.jsx`, `ReplaceCategoryModal.jsx`, `StatusBadge.jsx`, `ConfirmModal.jsx`, `Navbar.jsx`, `App.jsx`, `categoriaService.js`, `usuarioService.js`, `cartSlice.js`, `ProtectedRoute.jsx`

## 🚀 Nuevas Funcionalidades (Panel de Administración)

- **Panel de Gestión de Categorías (`/admin/categorias`)**
  - **CRUD Completo**: Ahora el administrador puede listar, crear y editar el nombre de las categorías.
  - **Eliminación Segura**: Se implementó una validación previa a la eliminación. Si la categoría a borrar contiene productos, un modal (`ReplaceCategoryModal`) obliga al administrador a seleccionar una categoría de reemplazo, transfiriendo todos los productos de forma masiva antes de proceder con la eliminación. Esto evita violaciones de restricción (`NOT NULL`) en la base de datos.

- **Panel de Gestión de Usuarios (`/admin/usuarios`)**
  - **Listado y Estado**: Visualización de todos los usuarios con indicadores visuales (`StatusBadge`) para identificar rápidamente si una cuenta está activa o deshabilitada (incluyendo fecha y hora exacta de baja).
  - **Edición de Roles**: Se integró un selector en línea que permite cambiar instantáneamente el rol de un usuario (`USER`, `VENDEDOR`, `ADMIN`).
  - **Baja Lógica (Soft Delete) y Restauración**: Botones dinámicos para deshabilitar o volver a activar cuentas de usuario.
  - **Eliminación Definitiva (Hard Delete)**: Funcionalidad para borrar un usuario de la base de datos, protegida por una doble confirmación que advierte de forma proactiva que la operación solo es posible si el usuario no tiene productos publicados.

## 🔒 Seguridad y Navegación

- **Mejora de Rutas Protegidas (`ProtectedRoute`)**
  - Se extendió el componente para aceptar el parámetro `requiredRole`. Esto garantiza que los usuarios normales (`USER`) no puedan acceder tipeando las URLs de administración, expulsándolos de vuelta al inicio de inmediato.
- **Navegación Unificada (Navbar)**
  - El botón suelto de "Admin Productos" se consolidó en un menú desplegable (Dropdown) llamado **Panel Admin** exclusivo para administradores, que agrupa el acceso a Productos, Categorías y Usuarios de forma limpia y ordenada.
- **Atajos en el Perfil**
  - Los administradores ahora tienen botones de acceso rápido a los tres paneles de administración directamente desde su menú de "Mi Perfil".

## 💅 Mejoras de UX/UI

- **Claridad de Acceso (Navbar)**
  - Se cambió el enlace genérico de **"Cuenta"** por **"Ingresar / Registrarse"** para los usuarios visitantes, haciendo la llamada a la acción mucho más descriptiva y amigable.
- **Modales Reutilizables**
  - Creación de un modal de confirmación genérico (`ConfirmModal`) que estandariza la estética de alertas críticas en todo el panel de administración.

## 🧹 Limpieza y Mantenimiento de Código (Deuda Técnica)

- **Servicios Modulares**
  - Se centralizaron todas las llamadas a las APIs de administración en archivos exclusivos (`usuarioService.js` y `categoriaService.js`) en lugar de hacer `fetch` directamente desde los componentes, mejorando la mantenibilidad.
- **Limpieza de Redux**
  - Se purgó el archivo `cartSlice.js` eliminando el thunk `fetchCartItems` que contenía URLs hardcodeadas obsoletas (apuntando a `localhost`), ya que el componente `Carrito.jsx` ahora gestiona su propio fetching utilizando la configuración global del proyecto.
