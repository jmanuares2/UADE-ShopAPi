import { useState } from 'react';

function ReplaceCategoryModal({ show, categoriaAEliminar, todasLasCategorias, onConfirm, onCancel, productosAfectadosCount }) {
  const [nuevaCategoriaId, setNuevaCategoriaId] = useState('');

  if (!show || !categoriaAEliminar) return null;

  const categoriasDisponibles = todasLasCategorias.filter(c => c.id !== categoriaAEliminar.id);

  const handleConfirm = () => {
    if (!nuevaCategoriaId) return;
    onConfirm(Number(nuevaCategoriaId));
  };

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content shadow">
            <div className="modal-header bg-warning">
              <h5 className="modal-title">Reasignar productos</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <p>
                La categoría <strong>{categoriaAEliminar.nombre}</strong> tiene <strong>{productosAfectadosCount}</strong> productos asociados.
              </p>
              <p>
                Para poder eliminarla, debés reasignar estos productos a otra categoría.
              </p>
              
              <div className="mb-3">
                <label className="form-label">Nueva categoría para los productos:</label>
                <select 
                  className="form-select" 
                  value={nuevaCategoriaId}
                  onChange={(e) => setNuevaCategoriaId(e.target.value)}
                >
                  <option value="">Seleccione una categoría...</option>
                  {categoriasDisponibles.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              {categoriasDisponibles.length === 0 && (
                <div className="alert alert-danger">
                  No hay otras categorías disponibles. Primero debés crear otra categoría para poder reasignar los productos.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleConfirm}
                disabled={!nuevaCategoriaId}
              >
                Reasignar y Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ReplaceCategoryModal;
