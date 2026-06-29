import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);

  const isFavorite = favoriteItems.some((item) => item.id === product.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita navegar al producto cuando se toca el favorito
    if (!user) {
      navigate('/login');
      return;
    }
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
    } else {
      dispatch(addFavorite(product));
    }
  };

  const handleCardClick = () => {
    navigate(`/productos/${product.id}`);
  };

  const formatPrecio = (val) => {
    if (val == null) return '0';
    return Math.round(Number(val)).toLocaleString('es-AR');
  };

  const calcularPrecioFinal = () => {
    if (product.descuento > 0) {
      return product.precio * (1 - product.descuento / 100);
    }
    return product.precio;
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'transparent',
        transition: 'transform 0.2s ease',
      }}
      className="product-card-container"
    >
      {/* Contenedor de imagen: 2/3 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1', // Proporción perfecta para que ocupe aprox 2/3 de la tarjeta
          background: '#f5f5f5',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
        }}
      >
        {product.imagenUrl ? (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            style={{
              width: '92%',
              height: '92%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
            }}
          />
        ) : (
          <span style={{ color: '#aaa', fontSize: '13px' }}>Sin imagen</span>
        )}

        {/* Badge de descuento */}
        {product.descuento > 0 && (
          <span className="badge bg-danger" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
            -{product.descuento}%
          </span>
        )}

        {/* Corazón de favorito arriba a la derecha */}
        <button
          onClick={handleFavoriteClick}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorite ? '#e53935' : '#111',
            transition: 'transform 0.2s ease',
            zIndex: 2,
          }}
          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      {/* Contenedor de datos: 1/3 */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 4px' }}>
        {/* Precio con descuento (si aplica) */}
        <div style={{ marginBottom: '4px' }}>
          {product.descuento > 0 ? (
            <div>
              <span style={{ color: '#777', textDecoration: 'line-through', fontSize: '13px', marginRight: '6px' }}>
                $ {formatPrecio(product.precio)}
              </span>
              <span style={{ color: '#e53935', fontWeight: 700, fontSize: '16px' }}>
                $ {formatPrecio(calcularPrecioFinal())}
              </span>
            </div>
          ) : (
            <div style={{ color: '#e53935', fontWeight: 700, fontSize: '16px' }}>
              $ {formatPrecio(product.precio)}
            </div>
          )}
        </div>

        {/* Nombre del producto */}
        <div
          style={{
            color: '#111',
            fontWeight: 400,
            fontSize: '15px',
            marginBottom: '2px',
            lineHeight: 1.3,
          }}
        >
          {product.nombre}
        </div>

        {/* Categoría */}
        <div style={{ color: '#777', fontSize: '13px', fontWeight: 300 }}>
          {product.categoriaNombre || 'General'}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
