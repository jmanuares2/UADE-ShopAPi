import { useState, useEffect } from 'react';
import { categoriaService } from '../../services/categoriaService';
import api from '../../services/api';
import ConfirmModal from '../common/ConfirmModal';
import ReplaceCategoryModal from '../common/ReplaceCategoryModal';

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [nombre, setNombre] = useState('');
  const [saving, setSaving] = useState(false);

  const [catToDelete, setCatToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [productosAfectados, setProductosAfectados] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriaService.getAllCategorias();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleNew = () => {
    setEditingCat(null);
    setNombre('');
    setShowForm(true);
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setNombre(cat.nombre);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingCat) {
        await categoriaService.updateCategoria(editingCat.id, { nombre });
      } else {
        await categoriaService.createCategoria({ nombre });
      }
      setShowForm(false);
      fetchCategorias();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (cat) => {
    setCatToDelete(cat);
    try {
      const res = await api.get(`/productos/categoria/${cat.id}`);
      const data = res.data;
      if (data.length > 0) {
        setProductosAfectados(data);
        setShowReplace(true);
      } else {
        setShowConfirm(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al verificar productos');
    }
  };

  const resetDeleteState = () => {
    setCatToDelete(null);
    setShowConfirm(false);
    setShowReplace(false);
    setIsDeleting(false);
  };

  const handleConfirmDeleteSimple = async () => {
    setIsDeleting(true);
    try {
      await categoriaService.deleteCategoria(catToDelete.id);
      fetchCategorias();
      resetDeleteState();
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  const handleConfirmReplaceAndDelete = async (nuevaCategoriaId) => {
    setIsDeleting(true);
    try {
      await categoriaService.deleteCategoria(catToDelete.id, nuevaCategoriaId);
      fetchCategorias();
      resetDeleteState();
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel Admin - Categorias</h2>
        <button className="btn btn-success" onClick={handleNew}>+ Nueva Categoria</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card p-4 shadow-sm mb-4">
          <h4 className="mb-3">{editingCat ? 'Editar Categoria' : 'Nueva Categoria'}</h4>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label">Nombre de la categoria *</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th style={{ width: '150px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td className="fw-medium">{cat.nombre}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(cat)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(cat)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr><td colSpan="3" className="text-center text-muted py-3">No hay categorias registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        show={showConfirm}
        title="Eliminar Categoria"
        onCancel={resetDeleteState}
        onConfirm={handleConfirmDeleteSimple}
        confirmLabel={isDeleting ? "Eliminando..." : "Eliminar"}
        confirmVariant="danger"
      >
        <p>Estas seguro de que queres eliminar la categoria <strong>{catToDelete?.nombre}</strong>?</p>
        <p className="text-muted small">Esta categoria no tiene productos asociados, por lo que puede eliminarse sin problemas.</p>
      </ConfirmModal>

      <ReplaceCategoryModal
        show={showReplace}
        categoriaAEliminar={catToDelete}
        todasLasCategorias={categorias}
        productosAfectadosCount={productosAfectados.length}
        onConfirm={handleConfirmReplaceAndDelete}
        onCancel={resetDeleteState}
      />
    </div>
  );
}

export default AdminCategorias;
