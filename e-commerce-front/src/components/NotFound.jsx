import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-secondary">404</h1>
        <h2 className="mb-3">Página no encontrada</h2>
        <p className="text-muted mb-4">La página que buscás no existe o fue movida.</p>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Ir al inicio
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
