import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setCart, emptyCart } from '../store/cartSlice';
import { useSelector, useDispatch } from 'react-redux';


function Carrito() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutMsg, setCheckoutMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCarrito();
  }, [user]);

  const fetchCarrito = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/carrito');
      const carrito = response.data;
      dispatch(setCart(carrito.items ?? []));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setErrorMsg(null);
    try {
      const response = await api.delete(`/carrito/items/${itemId}`);
      const carrito = response.data;
      dispatch(setCart(carrito.items ?? []));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al eliminar el item');
    }
  };

  const handleClear = async () => {
    setErrorMsg(null);
    try {
      const response = await api.delete('/carrito/clear');
      const carrito = response.data;
      dispatch(setCart(carrito.items ?? []));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al vaciar el carrito');
    }
  };

  const handleCheckout = async () => {
    setErrorMsg(null);
    try {
      const response = await api.post('/carrito/checkout');
      const msg = response.data;
      setCheckoutMsg(msg || 'Compra confirmada');
      dispatch(emptyCart());
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
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productoNombre || item.nombreProducto || item.producto?.nombre || '—'}</td>
                    <td>${item.precioUnitario?.toFixed(2)}</td>
                    <td>{item.cantidad}</td>
                    <td>${(item.precioUnitario * item.cantidad)?.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-danger" onClick={handleClear}>
              Vaciar carrito
            </button>
            <div className="text-end">
              <p className="fs-5 fw-bold mb-2">
                Total: ${cartItems.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0).toFixed(2)}
              </p>
              <button className="btn btn-success btn-lg" onClick={handleCheckout}>
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
