import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    passwordActual: '',
    passwordNueva: '',
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
      };
      if (form.passwordNueva) {
        payload.passwordActual = form.passwordActual;
        payload.passwordNueva = form.passwordNueva;
      }
      const response = await api.put('/perfil', payload);
      const updatedUser = response.data;
      login({
        ...user,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        email: updatedUser.email,
      });
      setSuccessMsg('Perfil actualizado correctamente.');
      setEditando(false);
      setForm((prev) => ({ ...prev, passwordActual: '', passwordNueva: '' }));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '520px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4">Mi Perfil</h3>

          {successMsg && (
            <div className="alert alert-success alert-dismissible py-2">
              {successMsg}
              <button type="button" className="btn-close" onClick={() => setSuccessMsg(null)}></button>
            </div>
          )}
          {errorMsg && (
            <div className="alert alert-danger alert-dismissible py-2">
              {errorMsg}
              <button type="button" className="btn-close" onClick={() => setErrorMsg(null)}></button>
            </div>
          )}

          {!editando ? (
            <>
              <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Rol:</strong>{' '}
                <span className={`badge ${user.role === 'ADMIN' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                  {user.role}
                </span>
              </p>
              <hr />
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-outline-primary" onClick={() => setEditando(true)}>
                  Editar perfil
                </button>
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
            </>
          ) : (
            <form onSubmit={handleGuardar}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <hr />
              <p className="text-muted small">Completá solo si querés cambiar la contraseña</p>
              <div className="mb-3">
                <label className="form-label">Contraseña actual</label>
                <input
                  type="password"
                  className="form-control"
                  name="passwordActual"
                  value={form.passwordActual}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="passwordNueva"
                  value={form.passwordNueva}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
