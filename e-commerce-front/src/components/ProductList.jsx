import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';
import { useDispatch } from 'react-redux';
import { fetchFavorites } from '../store/favoritesSlice';


function ProductList() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      } catch {
        // no bloquea si falla
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = categoriaSeleccionada
          ? `/productos/categoria/${categoriaSeleccionada}`
          : `/productos`;
        const response = await api.get(url);
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoriaSeleccionada]);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);


  return (
    <div className="container mt-4">
      <h2 className="mb-3">Catálogo de Productos</h2>

      {categorias.length > 0 && (
        <div className="mb-4">
          <select
            className="form-select w-auto"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Cargando productos...</p>
        </div>
      )}

      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-muted">No hay productos disponibles.</p>
      )}

      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
