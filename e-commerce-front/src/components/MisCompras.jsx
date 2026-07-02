import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMisCompras, clearError } from '../store/misComprasSlice';
import Resenas from './Resenas';

const MisCompras = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: compras, loading, error } = useSelector((state) => state.misCompras);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const calcularPrecioFinal = (item) => {
    if (item.descuento > 0) {
      return item.precioUnitario * (1 - item.descuento / 100);
    }
    return item.precioUnitario;
  };

  useEffect(() => {
    dispatch(fetchMisCompras());
    dispatch(clearError());

    // Limpiar el producto seleccionado si el modal se cierra
    const modalElement = document.getElementById('reseñaModal');
    const handleModalClose = () => setProductoSeleccionado(null);
    modalElement?.addEventListener('hidden.bs.modal', handleModalClose);

    return () => modalElement?.removeEventListener('hidden.bs.modal', handleModalClose);
  }, [dispatch]);

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
      <div className="mb-4">
        <h2>Mis Compras</h2>
      </div>

      <div className="d-flex flex-column gap-3">
        {compras.map((item) => {
          const precioFinal = calcularPrecioFinal(item);
          const precioMostrar = item.descuento > 0 ? precioFinal : item.precioUnitario;
          return (
            <div key={item.id} className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center" style={{ flex: '1 1 300px' }}>
                  {item.imagenProducto && (
                    <img
                      src={item.imagenProducto}
                      alt={item.nombreProducto}
                      className="rounded"
                      style={{ width: '70px', height: '70px', objectFit: 'cover', marginRight: '1rem' }}
                    />
                  )}
                  <div className="d-flex flex-column">
                    <h6 className="mb-1">{item.nombreProducto}</h6>
                    <small className="text-muted">
                      Comprado el: {new Date(item.fechaVenta).toLocaleDateString()}
                    </small>
                    <small className="text-muted">
                      Cantidad: {item.cantidad} | Precio unitario: ${Math.round(Number(precioMostrar || 0)).toLocaleString('es-AR')}
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3" style={{ flex: '1 1 200px', justifyContent: 'end' }}>
                  <span className="fw-bold fs-5">
                    ${Math.round(Number((item.descuento > 0 ? precioFinal * item.cantidad : item.subtotal || 0))).toLocaleString('es-AR')}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setProductoSeleccionado(item)}
                    data-bs-toggle="modal" data-bs-target="#reseñaModal"
                  >
                    Dejar reseña
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para Reseñas */}
      <div className="modal fade" id="reseñaModal" tabIndex="-1" aria-labelledby="reseñaModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="reseñaModalLabel">
                Opinión sobre: {productoSeleccionado?.nombreProducto}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {productoSeleccionado && (
                <Resenas productoId={productoSeleccionado.productoId} showForm={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisCompras;