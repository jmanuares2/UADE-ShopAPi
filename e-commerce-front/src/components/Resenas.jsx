import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResenas, guardarResena, eliminarResena } from '../store/resenaSlice';
import StarRating from './StarRating';

function Resenas({ productoId, vendedorId, showForm = true }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const entry = useSelector((state) => state.resenas.porProducto[productoId]);
  const resenas = entry?.items ?? [];
  const loading = entry?.loading ?? false;
  const error = entry?.error ?? null;

  const esVendedorDelProducto = user && vendedorId && user.userId === vendedorId;

  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeTipo, setMensajeTipo] = useState('success');

  useEffect(() => {
    dispatch(fetchResenas(productoId));
  }, [dispatch, productoId]);

  const miResena = user ? resenas.find((r) => r.usuarioId === user.userId) : null;

  useEffect(() => {
    if (miResena) {
      setPuntuacion(miResena.puntuacion);
      setComentario(miResena.comentario || '');
    } else {
      setPuntuacion(0);
      setComentario('');
    }
  }, [miResena]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (puntuacion < 1) {
      setMensaje('Elegí al menos 1 estrella para calificar');
      setMensajeTipo('danger');
      return;
    }
    setEnviando(true);
    setMensaje(null);
    try {
      await dispatch(guardarResena({ productoId, puntuacion, comentario })).unwrap();
      setMensaje('¡Gracias por tu opinión!');
      setMensajeTipo('success');
    } catch (err) {
      setMensaje(err.message || 'No se pudo guardar la reseña. Recuerda que debes haber comprado este producto.');
      setMensajeTipo('danger');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (resenaId) => {
    await dispatch(eliminarResena({ productoId, resenaId }));
  };

  return (
    <div className="mt-5">
      <h4>Opiniones del producto</h4>
      
      {showForm && (
        user ? ( // Si el usuario está logueado...
          !esVendedorDelProducto && ( // ...y NO es el vendedor de este producto, puede opinar.
            <form onSubmit={handleEnviar} className="card card-body mb-4">
              <label className="form-label fw-semibold">
                {miResena ? 'Editá tu reseña' : 'Dejá tu reseña'}
              </label>
              <StarRating value={puntuacion} onChange={setPuntuacion} />
              <textarea
                className="form-control mt-2"
                rows="3"
                placeholder="Contanos qué te pareció el producto (opcional)"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                maxLength={1000}
              />
              {mensaje && (
                <div className={`alert alert-${mensajeTipo} py-2 mt-2 mb-0`} role="alert">
                  {mensaje}
                </div>
              )}
              <div className="d-flex gap-2 mt-2">
                <button type="submit" className="btn btn-primary" disabled={enviando}>
                  {enviando ? 'Guardando...' : miResena ? 'Actualizar reseña' : 'Publicar reseña'}
                </button>
                {miResena && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleEliminar(miResena.id)}
                  >
                    Eliminar mi reseña
                  </button>
                )}
              </div>
            </form>
          )
        ) : ( // Si no está logueado
          <p className="text-muted">Iniciá sesión para dejar tu opinión sobre este producto.</p>
        )
      )}

      {loading && <div className="spinner-border spinner-border-sm"></div>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && resenas.length === 0 && <p>Este producto aún no tiene reseñas.</p>}

      {resenas.length > 0 && (
        <ul className="list-group">
          {resenas.map((r) => (
            <li key={r.id} className="list-group-item">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{r.usuarioNombre}</h5>
                <small>{new Date(r.fechaCreacion).toLocaleDateString()}</small>
              </div>
              <p className="mb-1">Puntuación: {'⭐'.repeat(r.puntuacion)}</p>
              <p className="mb-1">{r.comentario}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Resenas;