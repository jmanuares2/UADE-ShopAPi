import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mt-4">
        <p>Debés <Link to="/login">iniciar sesión</Link> para ver tu perfil.</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '480px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4">Mi Perfil</h3>
          <p><strong>Email:</strong> {user.email}</p>
          {user.nombre && <p><strong>Nombre:</strong> {user.nombre}</p>}
          <p>
            <strong>Rol:</strong>{' '}
            <span className={`badge ${user.role === 'ADMIN' ? 'bg-warning text-dark' : 'bg-primary'}`}>
              {user.role}
            </span>
          </p>
          <hr />
          <div className="d-flex flex-wrap gap-2">
            {user.role === 'ADMIN' && (
              <>
                <button className="btn btn-outline-warning" onClick={() => navigate('/admin/productos')}>
                  Panel Productos
                </button>
                <button className="btn btn-outline-warning" onClick={() => navigate('/admin/categorias')}>
                  Panel Categorías
                </button>
                <button className="btn btn-outline-warning" onClick={() => navigate('/admin/usuarios')}>
                  Panel Usuarios
                </button>
              </>
            )}
            <button className="btn btn-outline-primary" onClick={() => navigate('/carrito')}>
              Ver carrito
            </button>
            <button className="btn btn-outline-danger ms-auto" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
