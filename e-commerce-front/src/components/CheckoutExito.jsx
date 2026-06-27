import { useNavigate } from 'react-router-dom';

function CheckoutExito() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <div className="py-5">
        <div className="mb-4" style={{ fontSize: '4rem' }}>✓</div>
        <h2 className="mb-2 text-success">¡Compra realizada con éxito!</h2>
        <p className="text-muted mb-4">Tu pedido fue procesado correctamente. ¡Gracias por tu compra!</p>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/productos')}>
            Seguir comprando
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutExito;
