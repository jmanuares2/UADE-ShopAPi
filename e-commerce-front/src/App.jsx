import { BrowserRouter, Routes, Route } from 'react-router-dom';
// FavoriteProvider fue reemplazado por Redux (store/favoritesSlice.js)
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminProductList from './components/AdminProductList';
import AdminCategorias from './components/admin/AdminCategorias';
import AdminUsuarios from './components/admin/AdminUsuarios';
import Carrito from './components/Carrito';
import Favorite from './components/Favorite';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import CheckoutExito from './components/CheckoutExito';
import MisCompras from './components/MisCompras';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/carrito" element={<Carrito />} />
        {/* Esta ruta esta protegida: solo se puede ver si hay usuario logueado. */}
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute>
              <Favorite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-compras"
          element={
            <ProtectedRoute>
              <MisCompras />
            </ProtectedRoute>
          }
        />
        {/* Rutas de Admin protegidas */}
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR']}>
              <AdminProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminCategorias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminUsuarios />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout/exito" element={<CheckoutExito />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
