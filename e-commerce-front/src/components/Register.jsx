import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {loginSuccess } from '../store/authSlice';
import api from '../services/api';

function Register() {
  const [form, setForm] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
      const data = response.data;

      dispatch(loginSuccess({
        userId: data.userId,
        email: form.email,
        nombre: form.nombre,
        apellido: form.apellido,
        role: data.role
      }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4">Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            name="nombreUsuario"
            className="form-control"
            value={form.nombreUsuario}
            onChange={handleChange}
            required
          />
        </div>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              name="apellido"
              className="form-control"
              value={form.apellido}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p className="mt-3 text-center">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  );
}

export default Register;
