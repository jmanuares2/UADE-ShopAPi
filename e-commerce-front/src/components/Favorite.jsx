import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../store/favoritesSlice';
import ProductCard from './ProductCard';

function Favorite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const favoriteItems = useSelector((state) => state.favorites.items);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Favoritos</h2>

      {/* Renderizado condicional:
          si no hay favoritos mostramos un mensaje,
          si hay favoritos mostramos la grilla de productos. */}
      {favoriteItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Todavia no agregaste productos favoritos.</p>
          <button className="btn btn-primary" onClick={() => navigate('/productos')}>
            Ver productos
          </button>
        </div>
      ) : (
        <div className="row">
          {/* map recorre el array de favoritos y crea una tarjeta por producto. */}
          {favoriteItems.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorite;
