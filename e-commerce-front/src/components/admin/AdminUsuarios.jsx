import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/usuarioService';
import ConfirmModal from '../common/ConfirmModal';
import StatusBadge from '../common/StatusBadge';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals state
  const [userToProcess, setUserToProcess] = useState(null);
  const [actionType, setActionType] = useState(''); // 'soft-delete' | 'hard-delete' | 'restore'
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHardDeleteConfirm, setShowHardDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuarioService.getAllUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleRoleChange = async (usuario, newRole) => {
    try {
      // Para cambiar el rol necesitamos mandar el DTO completo con los datos actuales
      const dto = {
        nombreUsuario: usuario.nombreUsuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        role: newRole
      };
      await usuarioService.updateUsuario(usuario.id, dto);
      fetchUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleActionClick = (usuario, action) => {
    setUserToProcess(usuario);
    setActionType(action);
    if (action === 'hard-delete') {
      setShowHardDeleteConfirm(true);
    } else {
      setShowConfirm(true);
    }
  };

  const executeAction = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (actionType === 'soft-delete') {
        await usuarioService.deleteUsuario(userToProcess.id);
      } else if (actionType === 'restore') {
        await usuarioService.restoreUsuario(userToProcess.id);
      } else if (actionType === 'hard-delete') {
        await usuarioService.hardDeleteUsuario(userToProcess.id);
      }
      fetchUsuarios();
    } catch (err) {
      setError(err.message);
    } finally {
      setUserToProcess(null);
      setShowConfirm(false);
      setShowHardDeleteConfirm(false);
      setIsProcessing(false);
    }
  };

  const formatearFecha = (fechaArray) => {
    if (!fechaArray) return '';
    // fechaBaja viene como un array en JSON desde el backend: [yyyy, mm, dd, hh, min, ss, ns]
    if (Array.isArray(fechaArray) && fechaArray.length >= 3) {
      const [year, month, day, hour = 0, minute = 0] = fechaArray;
      const date = new Date(year, month - 1, day, hour, minute);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    return new Date(fechaArray).toLocaleString();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Panel Admin — Usuarios</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
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
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ width: '250px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    <div className="fw-medium">{u.nombre} {u.apellido}</div>
                    <div className="text-muted small">@{u.nombreUsuario}</div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      className="form-select form-select-sm w-auto" 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="VENDEDOR">VENDEDOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <StatusBadge activo={u.activo} />
                    {!u.activo && u.fechaBaja && (
                      <div className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
                        Baja: {formatearFecha(u.fechaBaja)}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {u.activo ? (
                        <button 
                          className="btn btn-sm btn-outline-warning" 
                          onClick={() => handleActionClick(u, 'soft-delete')}
                        >
                          Deshabilitar
                        </button>
                      ) : (
                        <button 
                          className="btn btn-sm btn-outline-success" 
                          onClick={() => handleActionClick(u, 'restore')}
                        >
                          Restaurar
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleActionClick(u, 'hard-delete')}
                      >
                        Eliminar Definitivo
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr><td colSpan="6" className="text-center text-muted py-3">No hay usuarios registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Soft Delete / Restore */}
      <ConfirmModal 
        show={showConfirm} 
        title={actionType === 'soft-delete' ? 'Deshabilitar Usuario' : 'Restaurar Usuario'} 
        onCancel={() => setShowConfirm(false)} 
        onConfirm={executeAction}
        confirmLabel={isProcessing ? "Procesando..." : (actionType === 'soft-delete' ? "Deshabilitar" : "Restaurar")}
        confirmVariant={actionType === 'soft-delete' ? "warning" : "success"}
      >
        <p>¿Estás seguro de que querés {actionType === 'soft-delete' ? 'deshabilitar' : 'restaurar'} al usuario <strong>{userToProcess?.email}</strong>?</p>
      </ConfirmModal>

      {/* Modal Hard Delete (Doble Confirmación) */}
      <ConfirmModal 
        show={showHardDeleteConfirm} 
        title="Eliminar Definitivamente" 
        onCancel={() => setShowHardDeleteConfirm(false)} 
        onConfirm={executeAction}
        confirmLabel={isProcessing ? "Eliminando..." : "Sí, eliminar definitivo"}
        confirmVariant="danger"
      >
        <div className="alert alert-danger">
          <h6 className="alert-heading fw-bold">¡ADVERTENCIA!</h6>
          <p className="mb-0">Solo se pueden eliminar definitivamente usuarios que <strong>NO tengan productos publicados</strong>.</p>
          <p className="mb-0">Si el usuario tiene productos, la operación será rechazada.</p>
        </div>
        <p>¿Estás absolutamente seguro de querer eliminar de la base de datos al usuario <strong>{userToProcess?.email}</strong>?</p>
        <p className="text-muted small">Esta acción no se puede deshacer.</p>
      </ConfirmModal>
    </div>
  );
}

export default AdminUsuarios;
