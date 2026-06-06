import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// FavoriteProvider fue reemplazado por Redux (store/favoritesSlice.js)
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminProductList from './components/AdminProductList';
import Carrito from './components/Carrito';
import Favorite from './components/Favorite';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
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
          <Route path="/admin/productos" element={<AdminProductList />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
