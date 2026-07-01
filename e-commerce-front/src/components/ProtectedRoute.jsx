import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



// Este componente protege una pantalla.
// Si hay usuario logueado, muestra el contenido.
// Si no hay usuario, manda al login.
// Si se provee requiredRole, verifica además que el rol coincida.
function ProtectedRoute({ children, requiredRole, allowedRoles }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
