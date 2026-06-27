import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { setCart } from '../store/cartSlice';

function ProductDetail() {
  // useParams lee parametros de la URL.
  // En este caso toma el id de /productos/:id.
  const { id } = useParams();

  // useNavigate permite movernos entre pantallas desde funciones.
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const favoriteItems = useSelector((state) => state.favorites.items);
  const cartItems = useSelector((state) => state.cart.items);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cartMsg, setCartMsg] = useState(null);
  const [cartMsgType, setCartMsgType] = useState('success');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/productos/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Producto no encontrado');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await api.post('/carrito/items', { productoId: product.id, cantidad });
      const carrito = response.data;
      dispatch(setCart(carrito.items ?? []));
      const itemActualizado = carrito.items?.find((item) => item.productoId === product.id);
      const nuevaCantidad = itemActualizado?.cantidad ?? cantidad;
      setCartMsg(`Agregado: ${cantidad}. En carrito: ${nuevaCantidad}`);
      setCartMsgType('success');
    } catch (err) {
      const data = err.response?.data;
      setCartMsg((typeof data === 'string' ? data : data?.message) || 'No se pudo agregar al carrito');
      setCartMsgType('danger');
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );
  if (error) return <div className="container mt-4"><p className="text-danger">{error}</p></div>;
  if (!product) return null;

  // Calculamos si el producto del detalle ya esta marcado como favorito.
  const isFavorite = favoriteItems.some((item) => item.id === product.id);
  const itemEnCarrito = cartItems.find((item) => item.productoId === product.id);
  const cantidadEnCarrito = itemEnCarrito?.cantidad ?? 0;

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        &larr; Volver
      </button>
      <div className="row">
        <div className="col-md-6">
          {product.imagenUrl ? (
            <img src={product.imagenUrl} alt={product.nombre} className="img-fluid rounded" />
          ) : (
            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
              <span className="text-muted">Sin imagen</span>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h2>{product.nombre}</h2>
          {product.categoriaNombre && (
            <span className="badge bg-secondary mb-2">{product.categoriaNombre}</span>
          )}
          <p className="text-muted">{product.descripcion}</p>
          {product.talle && <p><strong>Talle:</strong> {product.talle}</p>}
          {product.color && <p><strong>Color:</strong> {product.color}</p>}
          <h3 className="text-primary">${product.precio?.toFixed(2)}</h3>
          <p className={product.stock > 0 ? 'text-success' : 'text-danger'}>
            {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Sin stock'}
          </p>
          {user && cantidadEnCarrito > 0 && (
            <p className="text-primary fw-semibold">En tu carrito: {cantidadEnCarrito}</p>
          )}
          {product.creadorNombre && (
            <p className="text-muted"><small>Vendido por: {product.creadorNombre}</small></p>
          )}
          {cartMsg && (
            <div className={`alert alert-${cartMsgType} py-2`} role="alert">
              {cartMsg}
            </div>
          )}
          {/* Renderizado condicional:
              si hay usuario, mostramos acciones de compra/favoritos.
              si no hay usuario, abajo mostramos el mensaje para iniciar sesion. */}
          {user && (
            <div className="d-flex gap-2 mt-2">
              <button
                className={isFavorite ? 'btn btn-danger' : 'btn btn-outline-danger'}
                onClick={() => {
                  if (isFavorite) {
                    dispatch(removeFavorite(product.id));
                  } else {
                    dispatch(addFavorite(product));
                  }
                }}
              >
                {isFavorite ? '♥ Quitar de favoritos' : '♡ Agregar a favoritos'}
              </button>
              {product.stock > 0 && (
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={product.stock}
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.min(product.stock, Math.max(1, Number(e.target.value) || 1)))}
                    style={{ width: '90px' }}
                    aria-label="Cantidad"
                  />
                  <button className="btn btn-primary" onClick={handleAddToCart}>
                    Agregar al carrito
                  </button>
                </div>
              )}
            </div>
          )}
          {!user && (
            <p className="mt-3 text-muted">
              <Link to="/login">Iniciá sesión</Link> para comprar este producto.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
