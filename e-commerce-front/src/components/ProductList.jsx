import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from './ProductCard';
import { useDispatch } from 'react-redux';
import { fetchFavorites } from '../store/favoritesSlice';

function ProductList() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('');
  const [soloDescuento, setSoloDescuento] = useState(() => searchParams.get('descuento') === 'true');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchParams.get('descuento') === 'true') {
      setSoloDescuento(true);
    }
  }, [searchParams]);

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
      const response = await api.get('/productos');
      setProducts(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

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
    setOrdenPrecio('');
    setSoloDescuento(false);
  };

  const hayFiltrosActivos = busqueda || precioMin !== '' || precioMax !== '' || categoriaSeleccionada || ordenPrecio || soloDescuento;

  const productosFiltrados = useMemo(() => {
    let lista = [...products];

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter(p => p.nombre?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q));
    }

    if (categoriaSeleccionada) {
      lista = lista.filter(p => String(p.categoriaId || p.categoria?.id) === String(categoriaSeleccionada));
    }

    if (precioMin !== '') {
      lista = lista.filter(p => {
        const precioFinal = p.descuento > 0 ? p.precio * (1 - p.descuento / 100) : p.precio;
        return precioFinal >= Number(precioMin);
      });
    }

    if (precioMax !== '') {
      lista = lista.filter(p => {
        const precioFinal = p.descuento > 0 ? p.precio * (1 - p.descuento / 100) : p.precio;
        return precioFinal <= Number(precioMax);
      });
    }

    if (soloDescuento) {
      lista = lista.filter(p => p.descuento && p.descuento > 0);
    }

    if (ordenPrecio === 'menor') {
      lista.sort((a, b) => {
        const precioA = a.descuento > 0 ? a.precio * (1 - a.descuento / 100) : a.precio;
        const precioB = b.descuento > 0 ? b.precio * (1 - b.descuento / 100) : b.precio;
        return precioA - precioB;
      });
    } else if (ordenPrecio === 'mayor') {
      lista.sort((a, b) => {
        const precioA = a.descuento > 0 ? a.precio * (1 - a.descuento / 100) : a.precio;
        const precioB = b.descuento > 0 ? b.precio * (1 - b.descuento / 100) : b.precio;
        return precioB - precioA;
      });
    }

    return lista;
  }, [products, busqueda, categoriaSeleccionada, precioMin, precioMax, soloDescuento, ordenPrecio]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Catálogo de Productos</h2>

      <div className="row">
        {/* Panel izquierdo de Filtros */}
        <div className="col-12 col-md-3 mb-4">
          <div className="card shadow-sm border-0 p-3" style={{ background: '#f8f9fa' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">Filtros</h5>
              {hayFiltrosActivos && (
                <button className="btn btn-link btn-sm text-danger p-0 text-decoration-none" onClick={handleLimpiarFiltros}>
                  Limpiar
                </button>
              )}
            </div>

            {/* Buscar */}
            <div className="mb-3">
              <label className="form-label fw-semibold fs-6">Buscar producto</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nombre o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Categoría */}
            <div className="mb-3">
              <label className="form-label fw-semibold fs-6">Categoría</label>
              <select
                className="form-select form-select-sm"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            {/* Precio mín y máx */}
            <div className="mb-3">
              <label className="form-label fw-semibold fs-6">Rango de precio</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Mín"
                  min="0"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Máx"
                  min="0"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                />
              </div>
            </div>

            {/* Ordenar por precio */}
            <div className="mb-3">
              <label className="form-label fw-semibold fs-6">Ordenar por</label>
              <select
                className="form-select form-select-sm"
                value={ordenPrecio}
                onChange={(e) => setOrdenPrecio(e.target.value)}
              >
                <option value="">Relevancia</option>
                <option value="menor">Precio: menor a mayor</option>
                <option value="mayor">Precio: mayor a menor</option>
              </select>
            </div>

            {/* Filtros de tilde (checkbox) */}
            <div className="mb-2">
              <label className="form-label fw-semibold fs-6">Especiales</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="chkDescuento"
                  checked={soloDescuento}
                  onChange={(e) => setSoloDescuento(e.target.checked)}
                />
                <label className="form-check-label fs-6" htmlFor="chkDescuento">
                  Con descuento
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Grilla de Productos */}
        <div className="col-12 col-md-9">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">Cargando productos...</p>
            </div>
          )}

          {error && <p className="text-danger">Error: {error}</p>}

          {!loading && !error && productosFiltrados.length === 0 && (
            <div className="text-center py-5 bg-light rounded">
              <p className="text-muted mb-0">No se encontraron productos que coincidan con los filtros.</p>
            </div>
          )}

          <div className="row">
            {productosFiltrados.map((product) => (
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
