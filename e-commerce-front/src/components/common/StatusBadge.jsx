function StatusBadge({ activo }) {
  return (
    <span className={`badge ${activo ? 'bg-success' : 'bg-danger'}`}>
      {activo ? 'ACTIVO' : 'DESHABILITADO'}
    </span>
  );
}

export default StatusBadge;
