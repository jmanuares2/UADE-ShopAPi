import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      <style>
        {`
          .nav-cuenta-link {
            color: rgba(255, 255, 255, 0.7) !important;
            transition: all 0.3s ease;
            cursor: pointer;
            padding: 0.5rem 1rem;
          }
          .nav-cuenta-link:hover {
            color: #ffffff !important;
            text-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
          }
        `}
      </style>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-4" to="/">UADE Shop</Link>
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav me-auto fw-medium">
              {isAdmin && (
                <li className="nav-item dropdown">
                  <a className="nav-link px-3 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Panel Admin
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/admin/productos" onClick={() => setIsOpen(false)}>Productos</Link></li>
                    <li><Link className="dropdown-item" to="/admin/categorias" onClick={() => setIsOpen(false)}>Categorías</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/admin/usuarios" onClick={() => setIsOpen(false)}>Usuarios</Link></li>
                  </ul>
                </li>
              )}
              {user && (
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/carrito" onClick={() => setIsOpen(false)}>Mi Carrito</Link>
                </li>
              )}
              {/* Este link aparece solamente si existe user.
                  Es otro ejemplo de renderizado condicional. */}
              {user && (
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/favoritos" onClick={() => setIsOpen(false)}>Mis Favoritos</Link>
                </li>
              )}
            </ul>
            
            <ul className="navbar-nav ms-auto align-items-center">
              {!user ? (
                <li className="nav-item">
                  <Link to="/login" className="nav-link nav-cuenta-link fw-semibold" onClick={() => setIsOpen(false)}>Ingresar / Registrarse</Link>
                </li>
              ) : (
                <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                  <Link 
                    className="text-white text-decoration-none fw-semibold d-flex align-items-center px-3 py-2 rounded-pill" 
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', transition: 'all 0.3s ease' }} 
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="bg-white text-dark rounded-circle d-flex justify-content-center align-items-center fw-bold me-2" style={{width: '32px', height: '32px'}}>
                      {(user.nombre || user.email).charAt(0).toUpperCase()}
                    </div>
                    {user.nombre || user.email.split('@')[0]}
                    {isAdmin && <span className="badge bg-warning text-dark ms-2 rounded-pill">ADMIN</span>}
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
