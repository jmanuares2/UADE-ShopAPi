import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import { setCart } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';
import { API_URL, authHeaders } from '../services/api';

function ProductCard({ product, onAddToCart }) {
  const { user } = useAuth();

  // useDispatch permite ejecutar acciones sobre el store de Redux
  const dispatch = useDispatch();

  // useSelector lee el estado de favoritos del store
  const favoriteItems = useSelector((state) => state.favorites.items);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState('success');

  // Revisamos si este producto ya esta en favoritos.
  // Eso sirve para pintar el boton lleno o vacio.
  const isFavorite = favoriteItems.some((item) => item.id === product.id);

  const showMsg = (text, type = 'success') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/carrito/items`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ productoId: product.id, cantidad: 1 }),
      });
      if (!response.ok) throw new Error('No se pudo agregar al carrito');
      const carrito = await response.json();
      dispatch(setCart(carrito.items ?? []));
      if (onAddToCart) onAddToCart();
      showMsg('Producto agregado al carrito');
    } catch (err) {
      showMsg(err.message, 'danger');
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
              onClick={() => dispatch(toggleFavorite(product))}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          )}
          {user && product.stock > 0 && (
            <button className="btn btn-primary btn-sm flex-fill" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
