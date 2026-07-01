import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false);
  const [pasoCambioPassword, setPasoCambioPassword] = useState(0); // 0: no, 1: verificar actual, 2: ingresar nueva
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    passwordActual: '',
    passwordNueva: '',
    passwordNuevaConfirmar: '',
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


  const handleVerificarPasswordActual = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const response = await api.post('/perfil/verificar-password', { passwordActual: form.passwordActual });
      if (response.data.valido) {
        setPasoCambioPassword(2);
        setErrorMsg(null);
      } else {
        setErrorMsg('La contraseña actual es incorrecta');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al verificar la contraseña');
    }
  };

  const handleCancelarCambioPassword = () => {
    setPasoCambioPassword(0);
    setForm((prev) => ({ ...prev, passwordActual: '', passwordNueva: '', passwordNuevaConfirmar: '' }));
  };

  const handleGuardarCambioPassword = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (form.passwordNueva !== form.passwordNuevaConfirmar) {
      setErrorMsg('Las nuevas contraseñas no coinciden');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        passwordActual: form.passwordActual,
        passwordNueva: form.passwordNueva,
      };
      const response = await api.put('/perfil', payload);
      const updatedUser = response.data;
      login({
        ...user,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        email: updatedUser.email,
      });
      setSuccessMsg('Perfil y contraseña actualizados correctamente.');
      setEditando(false);
      setPasoCambioPassword(0);
      setForm((prev) => ({ ...prev, passwordActual: '', passwordNueva: '', passwordNuevaConfirmar: '' }));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleGuardarPerfil = async (e) => {
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
      setForm((prev) => ({ ...prev, passwordActual: '', passwordNueva: '', passwordNuevaConfirmar: '' }));
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
          {pasoCambioPassword === 0 ? (
            <h3 className="card-title mb-4">Mi Perfil</h3>
          ):(
            <h3 className="card-title mb-4">Cambiar Contraseña</h3>
          )}

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
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Apellido:</strong> {user.apellido}</p>
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
          ) : pasoCambioPassword === 0 ? (
            <form onSubmit={handleGuardarPerfil}>
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
              <button type="button" className="btn btn-outline-primary mb-3" onClick={() => setPasoCambioPassword(1)}>
                Cambiar contraseña
              </button>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : pasoCambioPassword === 1 ? (
            <form onSubmit={handleVerificarPasswordActual}>
              <div className="mb-3">
                <p className="text-muted small">Primero ingresa tu contraseña actual para confirmar el cambio</p>
                <label className="form-label">Contraseña Actual</label>
                <input
                  type="password"
                  className="form-control"
                  name="passwordActual"
                  value={form.passwordActual}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Verificando...' : 'Verificar contraseña'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancelarCambioPassword}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleGuardarCambioPassword}>
              <div className="mb-3">
                <label className="form-label">Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="passwordNueva"
                  value={form.passwordNueva}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="passwordNuevaConfirmar"
                  value={form.passwordNuevaConfirmar}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar nueva contraseña'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancelarCambioPassword}>
                  Cancelar
                </button>
              </div>
            </form>
          )
          }
        </div>
      </div>
    </div>
  );
}

export default Profile;
