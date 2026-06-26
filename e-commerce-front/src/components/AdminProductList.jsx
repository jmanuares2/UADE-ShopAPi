import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';

function AdminProductList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'VENDEDOR')) {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/productos');
      if (user?.role === 'VENDEDOR') {
        setProducts(response.data.filter((p) => p.creadorId === user.userId));
      } else {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id) => {
    setDeleteError(null);
    try {
      await api.delete(`/productos/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setEditingProduct(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'VENDEDOR')) return null;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{user?.role === 'VENDEDOR' ? 'Panel Vendedor — Mis Productos' : 'Panel Admin — Productos'}</h2>
        <button className="btn btn-success" onClick={handleNew}>+ Nuevo producto</button>
      </div>

      {showForm && (
        <div className="mb-4">
          <ProductForm
            product={editingProduct}
            onSaved={handleSaved}
            onCancel={() => { setShowForm(false); setEditingProduct(null); }}
          />
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}
      {deleteError && <div className="alert alert-danger">{deleteError}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Vendedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoriaNombre || '—'}</td>
                  <td>${p.precio?.toFixed(2)}</td>
                  <td>
                    <span className={p.stock > 0 ? 'text-success' : 'text-danger'}>
                      {p.stock}
                    </span>
                  </td>
                  <td>{p.creadorNombre || '—'}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="text-muted text-center">No hay productos.</p>}
        </div>
      )}
    </div>
  );
}

export default AdminProductList;
