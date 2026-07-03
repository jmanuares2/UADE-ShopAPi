import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotificaciones,
  fetchCantidadNoLeidas,
  marcarComoLeida,
  marcarTodasComoLeidas,
} from '../store/notificacionesSlice';

const INTERVALO_POLLING_MS = 30000; // revisa notificaciones nuevas cada 30s

function NotificacionesBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const notificaciones = useSelector((state) => state.notificaciones.items);
  const cantidadNoLeidas = useSelector((state) => state.notificaciones.cantidadNoLeidas);

  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  // Polling: mientras haya cualquier usuario logueado (comprador, vendedor o admin),
  // chequea cada 30s si hay notificaciones nuevas. Un comprador recibe notificaciones
  // de "te respondieron tu pregunta"; un vendedor recibe las de venta y pregunta nueva.
  useEffect(() => {
    if (!user) return;

    dispatch(fetchCantidadNoLeidas());
    const intervalo = setInterval(() => {
      dispatch(fetchCantidadNoLeidas());
    }, INTERVALO_POLLING_MS);

    return () => clearInterval(intervalo);
  }, [user, dispatch]);

  // Cierra el dropdown si el usuario clickea afuera.
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  const handleToggle = () => {
    const nuevoEstado = !abierto;
    setAbierto(nuevoEstado);
    if (nuevoEstado) {
      dispatch(fetchNotificaciones());
    }
  };

  const handleNotifClick = (notif) => {
    if (!notif.leida) {
      dispatch(marcarComoLeida(notif.id));
    }
    setAbierto(false);
    if (notif.productoId) {
      navigate(`/productos/${notif.productoId}`);
    }
  };

  const formatearFecha = (fecha) => {
    const diffMs = Date.now() - new Date(fecha).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'ahora';
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `hace ${diffHoras} h`;
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  // La campana es visible para cualquier usuario logueado.
  if (!user) return null;

  return (
    <div className="position-relative" ref={contenedorRef}>
      <button
        type="button"
        className="nav-link bg-transparent border-0 text-white position-relative p-2"
        style={{ lineHeight: 1 }}
        onClick={handleToggle}
        aria-label="Notificaciones"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {cantidadNoLeidas > 0 && (
          <span
            className="badge bg-danger rounded-pill position-absolute"
            style={{ top: 0, right: 0, fontSize: '0.65rem' }}
          >
            {cantidadNoLeidas > 9 ? '9+' : cantidadNoLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div
          className="card shadow position-absolute end-0 mt-2"
          style={{ width: '340px', maxHeight: '420px', overflowY: 'auto', zIndex: 1050 }}
        >
          <div className="card-header d-flex justify-content-between align-items-center bg-white">
            <strong>Notificaciones</strong>
            {cantidadNoLeidas > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-link p-0"
                onClick={() => dispatch(marcarTodasComoLeidas())}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          <div className="list-group list-group-flush">
            {notificaciones.length === 0 ? (
              <div className="p-3 text-center text-muted">No tenés notificaciones todavía</div>
            ) : (
              notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  className="list-group-item"
                  style={{ cursor: 'pointer', backgroundColor: notif.leida ? 'white' : '#f0f7ff' }}
                  onClick={() => handleNotifClick(notif)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <p className="mb-1" style={{ fontSize: '0.9rem' }}>{notif.mensaje}</p>
                    {!notif.leida && <span className="badge bg-primary rounded-pill ms-2">nuevo</span>}
                  </div>
                  <small className="text-muted">{formatearFecha(notif.fechaCreacion)}</small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificacionesBell;
