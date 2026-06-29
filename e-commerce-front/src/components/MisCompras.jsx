import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMisCompras, clearError } from '../store/misComprasSlice';

const MisCompras = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: compras, loading, error } = useSelector((state) => state.misCompras);

  const calcularPrecioFinal = (item) => {
    if (item.descuento > 0) {
      return item.precioUnitario * (1 - item.descuento / 100);
    }
    return item.precioUnitario;
  };

  useEffect(() => {
    dispatch(fetchMisCompras());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    console.log('Datos de compras:', compras);
  }, [compras]);

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

      <div className="card shadow-sm">
        <div className="card-body">
          {compras.map((item) => {
            const precioFinal = calcularPrecioFinal(item);
            const precioMostrar = item.descuento > 0 ? precioFinal : item.precioUnitario;
            return (
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
                    <h6 className="mb-0 d-flex align-items-center">
                      {item.nombreProducto}
                      {item.descuento > 0 && (
                        <span className="badge bg-danger ms-2">-{item.descuento}%</span>
                      )}
                    </h6>
                    <small className="text-muted">
                      Cantidad: {item.cantidad} - Precio: 
                      <span className={item.descuento > 0 ? 'text-danger ms-1' : 'ms-1'}>
                        ${Math.round(Number(precioMostrar || 0)).toLocaleString('es-AR')}
                      </span>
                      - Fecha: {new Date(item.fechaVenta).toLocaleString('es-AR')}
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="fw-bold fs-5 text-success">
                    ${Math.round(Number((item.descuento > 0 ? precioFinal * item.cantidad : item.subtotal || 0))).toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MisCompras;