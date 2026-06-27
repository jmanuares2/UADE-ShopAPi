import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';
import { useDispatch } from 'react-redux';
import { fetchFavorites } from '../store/favoritesSlice';

function ProductList() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (busqueda.trim()) {
        response = await api.get('/productos/buscar', { params: { q: busqueda.trim() } });
      } else if (precioMin !== '' && precioMax !== '') {
        response = await api.get('/productos/filtrar', {
          params: { precioMin: Number(precioMin), precioMax: Number(precioMax) },
        });
      } else if (categoriaSeleccionada) {
        response = await api.get(`/productos/categoria/${categoriaSeleccionada}`);
      } else {
        response = await api.get('/productos');
      }
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [busqueda, precioMin, precioMax, categoriaSeleccionada]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setPrecioMin('');
    setPrecioMax('');
    setCategoriaSeleccionada('');
  };

  const hayFiltrosActivos = busqueda || precioMin || precioMax || categoriaSeleccionada;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Catálogo de Productos</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Buscar por nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: remera, zapatilla..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setCategoriaSeleccionada('');
                  setPrecioMin('');
                  setPrecioMax('');
                }}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Categoría</label>
              <select
                className="form-select"
                value={categoriaSeleccionada}
                onChange={(e) => {
                  setCategoriaSeleccionada(e.target.value);
                  setBusqueda('');
                }}
                disabled={!!busqueda}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Precio mín.</label>
              <input
                type="number"
                className="form-control"
                placeholder="0"
                min="0"
                value={precioMin}
                onChange={(e) => {
                  setPrecioMin(e.target.value);
                  setBusqueda('');
                  setCategoriaSeleccionada('');
                }}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Precio máx.</label>
              <input
                type="number"
                className="form-control"
                placeholder="9999"
                min="0"
                value={precioMax}
                onChange={(e) => {
                  setPrecioMax(e.target.value);
                  setBusqueda('');
                  setCategoriaSeleccionada('');
                }}
              />
            </div>

            <div className="col-md-1 d-flex align-items-end">
              {hayFiltrosActivos && (
                <button className="btn btn-outline-secondary w-100" onClick={handleLimpiarFiltros} title="Limpiar filtros">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Cargando productos...</p>
        </div>
      )}

      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-muted">No se encontraron productos con los filtros seleccionados.</p>
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
