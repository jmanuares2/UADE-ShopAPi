import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMisCompras, eliminarVenta, limpiarHistorial, clearError } from '../store/misComprasSlice';

const MisCompras = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: compras, loading, error } = useSelector((state) => state.misCompras);

  useEffect(() => {
    dispatch(fetchMisCompras());
    dispatch(clearError());
  }, [dispatch]);

  const handleEliminar = (id) => {
    dispatch(eliminarVenta(id));
  };

  const handleLimpiarHistorial = () => {
    dispatch(limpiarHistorial());
  };

  if (loading) {
    return (
      <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="container mt-4">
      <h2 className="mb-4">Mis Compras</h2>
      <div className="text-center py-5">
          <p className="text-muted fs-5">Aún no realizaste ninguna compra.</p>
          <button className="btn btn-primary" onClick={() => navigate('/productos')}>
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Compras</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLimpiarHistorial}>
          Limpiar Historial
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {compras.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-3">
              <div className="d-flex align-items-center">
                {item.imagenProducto && (
                  <img
                    src={item.imagenProducto}
                    alt={item.nombreProducto}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '1rem' }}
                  />
                )}
                <div>
                  <h6 className="mb-0">{item.nombreProducto}</h6>
                  <small className="text-muted">
                    Cantidad: {item.cantidad} - Precio: ${item.precioUnitario.toFixed(2)} - Fecha: {new Date(item.fechaVenta).toLocaleString('es-AR')}
                  </small>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="fw-bold me-3">
                  ${item.subtotal.toFixed(2)}
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleEliminar(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MisCompras;