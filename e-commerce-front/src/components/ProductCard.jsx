import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { setCart } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function ProductCard({ product }) {
  const { user } = useAuth();

  // useDispatch permite ejecutar acciones sobre el store de Redux
  const dispatch = useDispatch();

  // useSelector lee el estado de favoritos del store
  const favoriteItems = useSelector((state) => state.favorites.items);
  const cartItems = useSelector((state) => state.cart.items);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState('success');
  const [cantidad, setCantidad] = useState(1);

  // Revisamos si este producto ya esta en favoritos.
  // Eso sirve para pintar el boton lleno o vacio.
  const isFavorite = favoriteItems.some((item) => item.id === product.id);
  const itemEnCarrito = cartItems.find((item) => item.productoId === product.id);
  const cantidadEnCarrito = itemEnCarrito?.cantidad ?? 0;

  const showMsg = (text, type = 'success') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!user) return;
    try {
      const response = await api.post('/carrito/items', { productoId: product.id, cantidad });
      const carrito = response.data;
      dispatch(setCart(carrito.items ?? []));
      const itemActualizado = carrito.items?.find((item) => item.productoId === product.id);
      const nuevaCantidad = itemActualizado?.cantidad ?? cantidad;
      showMsg(`Agregado: ${cantidad}. En carrito: ${nuevaCantidad}`);
    } catch (err) {
      const data = err.response?.data;
      showMsg((typeof data === 'string' ? data : data?.message) || 'No se pudo agregar al carrito', 'danger');
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      {product.imagenUrl && (
        <img src={product.imagenUrl} className="card-img-top" alt={product.nombre} style={{ height: '200px', objectFit: 'cover' }} />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>
        {product.categoriaNombre && (
          <span className="badge bg-secondary mb-2" style={{ width: 'fit-content' }}>{product.categoriaNombre}</span>
        )}
        <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>{product.descripcion}</p>
        {product.talle && <p className="card-text mb-1"><small>Talle: {product.talle}</small></p>}
        {product.color && <p className="card-text mb-1"><small>Color: {product.color}</small></p>}
        <p className="card-text fw-bold fs-5 mt-auto">${product.precio?.toFixed(2)}</p>
        <p className="card-text"><small className={product.stock > 0 ? 'text-success' : 'text-danger'}>
          {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
        </small></p>
        {user && cantidadEnCarrito > 0 && (
          <p className="card-text mb-2">
            <small className="text-primary fw-semibold">En carrito: {cantidadEnCarrito}</small>
          </p>
        )}
        {msg && (
          <div className={`alert alert-${msgType} py-1 px-2 mb-2`} style={{ fontSize: '0.8rem' }}>
            {msg}
          </div>
        )}
        <div className="d-flex gap-2 mt-2">
          <Link to={`/productos/${product.id}`} className="btn btn-outline-primary btn-sm flex-fill">
            Ver detalle
          </Link>
          {/* El corazon solo aparece si el usuario esta logueado.
              Al tocarlo llamamos a addToFavorite(product). */}
          {user && (
            <button
              className={isFavorite ? 'btn btn-danger btn-sm' : 'btn btn-outline-danger btn-sm'}
              onClick={() => {
                if (isFavorite) {
                  dispatch(removeFavorite(product.id));
                } else {
                  dispatch(addFavorite(product));
                }
              }}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          )}
          {user && product.stock > 0 && (
            <div className="d-flex gap-2 flex-fill">
              <input
                type="number"
                className="form-control form-control-sm"
                min="1"
                max={product.stock}
                value={cantidad}
                onChange={(e) => setCantidad(Math.min(product.stock, Math.max(1, Number(e.target.value) || 1)))}
                style={{ width: '72px' }}
                aria-label="Cantidad"
              />
              <button className="btn btn-primary btn-sm flex-fill" onClick={handleAddToCart}>
                Agregar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
