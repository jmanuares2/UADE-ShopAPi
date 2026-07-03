import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { setCart, emptyCart } from '../store/cartSlice';
import { useSelector, useDispatch } from 'react-redux';


function Carrito() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutMsg, setCheckoutMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  // Función para calcular precio final con descuento
  const calcularPrecioFinal = (item) => {
    if (item.descuento > 0) {
      return item.precioUnitario * (1 - item.descuento / 100);
    }
    return item.precioUnitario;
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCarrito();
  }, [user]);

  const fetchCarrito = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/carrito');
      dispatch(setCart(response.data.items ?? []));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCantidad = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setUpdatingItem(itemId);
    setErrorMsg(null);
    try {
      const response = await api.put(`/carrito/items/${itemId}`, null, { params: { cantidad: nuevaCantidad } });
      dispatch(setCart(response.data.items ?? []));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al actualizar la cantidad');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setErrorMsg(null);
    try {
      const response = await api.delete(`/carrito/items/${itemId}`);
      dispatch(setCart(response.data.items ?? []));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al eliminar el item');
    }
  };

  const handleClear = async () => {
    setErrorMsg(null);
    try {
      const response = await api.delete('/carrito/clear');
      dispatch(setCart(response.data.items ?? []));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al vaciar el carrito');
    }
  };

  const handleCheckout = async () => {
    setErrorMsg(null);
    try {
      await api.post('/carrito/checkout');
      dispatch(emptyCart());
      navigate('/checkout/exito');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data || 'Error en el checkout');
    }
  };

  if (!user) return null;

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );
  if (error) return <div className="container mt-4"><p className="text-danger">{error}</p></div>;

  const UMBRAL_ENVIO_GRATIS = 30000;
  const COSTO_ENVIO = 3800;

  const totalProductos = cartItems.reduce((acc, i) => acc + calcularPrecioFinal(i) * i.cantidad, 0);

  const aplicaEnvioGratis = totalProductos >= UMBRAL_ENVIO_GRATIS || totalProductos === 0;
  const costoEnvioFinal = aplicaEnvioGratis ? 0 : COSTO_ENVIO;
  const totalFinal = totalProductos + costoEnvioFinal;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mi Carrito</h2>

      {checkoutMsg && (
        <div className="alert alert-success alert-dismissible">
          {checkoutMsg}
          <button type="button" className="btn-close" onClick={() => setCheckoutMsg(null)}></button>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger alert-dismissible">
          {errorMsg}
          <button type="button" className="btn-close" onClick={() => setErrorMsg(null)}></button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Tu carrito está vacío.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Ver productos</button>
        </div>
      ) : (
        <>
          <div className="table-responsive mb-3">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Precio unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const precioFinal = calcularPrecioFinal(item);
                  const subtotal = precioFinal * item.cantidad;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div>
                          {item.productoNombre || item.nombreProducto || item.producto?.nombre || '—'}
                          {item.descuento > 0 && (
                            <span className="badge bg-danger ms-2">-{item.descuento}%</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {item.descuento > 0 ? (
                          <div>
                            <span className="text-muted text-decoration-line-through me-2">
                              ${Math.round(Number(item.precioUnitario || 0)).toLocaleString('es-AR')}
                            </span>
                            <span className="fw-semibold text-danger">
                              ${Math.round(Number(precioFinal || 0)).toLocaleString('es-AR')}
                            </span>
                          </div>
                        ) : (
                          <span>${Math.round(Number(item.precioUnitario || 0)).toLocaleString('es-AR')}</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ width: '30px', padding: '0' }}
                            onClick={() => handleUpdateCantidad(item.id, item.cantidad - 1)}
                            disabled={updatingItem === item.id || item.cantidad <= 1}
                          >−</button>
                          <span className="fw-semibold" style={{ minWidth: '24px', textAlign: 'center' }}>
                            {updatingItem === item.id
                              ? <span className="spinner-border spinner-border-sm" role="status"></span>
                              : item.cantidad}
                          </span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ width: '30px', padding: '0' }}
                            onClick={() => handleUpdateCantidad(item.id, item.cantidad + 1)}
                            disabled={updatingItem === item.id}
                          >+</button>
                        </div>
                      </td>
                      <td>${Math.round(Number(subtotal || 0)).toLocaleString('es-AR')}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-start">
            <button className="btn btn-outline-danger" onClick={handleClear}>
              Vaciar carrito
            </button>
            <div className="text-end" style={{ minWidth: '300px' }}>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Subtotal:</span>
                <span>${Math.round(totalProductos).toLocaleString('es-AR')}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Envío:</span>
                {aplicaEnvioGratis ? (
                  <span className="text-success">Gratis</span>
                ) : (
                  <span>${costoEnvioFinal.toLocaleString('es-AR')}</span>
                )}
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total:</span>
                <span>${Math.round(totalFinal).toLocaleString('es-AR')}</span>
              </div>
              <button className="btn btn-success btn-lg mt-3 w-100" onClick={handleCheckout}>
                Confirmar compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Carrito;