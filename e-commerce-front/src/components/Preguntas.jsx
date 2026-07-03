import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPreguntas, crearPregunta, responderPregunta, eliminarPregunta } from '../store/preguntaSlice';

function Preguntas({ productoId, vendedorId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const entry = useSelector((state) => state.preguntas.porProducto[productoId]);
  const preguntas = entry?.items ?? [];

  const [textoPregunta, setTextoPregunta] = useState('');
  const [enviandoPregunta, setEnviandoPregunta] = useState(false);
  const [errorPregunta, setErrorPregunta] = useState(null);

  // Texto de respuesta en edición, indexado por id de pregunta.
  const [respuestasEnCurso, setRespuestasEnCurso] = useState({});
  const [enviandoRespuestaId, setEnviandoRespuestaId] = useState(null);

  useEffect(() => {
    dispatch(fetchPreguntas(productoId));
  }, [dispatch, productoId]);

  const esVendedorDelProducto = user && vendedorId && user.userId === vendedorId;

  const handleEnviarPregunta = async (e) => {
    e.preventDefault();
    if (!textoPregunta.trim()) {
      setErrorPregunta('Escribí tu pregunta antes de enviarla');
      return;
    }
    setEnviandoPregunta(true);
    setErrorPregunta(null);
    const resultado = await dispatch(crearPregunta({ productoId, texto: textoPregunta.trim() }));
    setEnviandoPregunta(false);
    if (crearPregunta.fulfilled.match(resultado)) {
      setTextoPregunta('');
    } else {
      setErrorPregunta(resultado.payload || 'No se pudo enviar la pregunta');
    }
  };

  const handleEnviarRespuesta = async (preguntaId) => {
    const respuesta = (respuestasEnCurso[preguntaId] || '').trim();
    if (!respuesta) return;
    setEnviandoRespuestaId(preguntaId);
    await dispatch(responderPregunta({ productoId, preguntaId, respuesta }));
    setEnviandoRespuestaId(null);
    setRespuestasEnCurso((prev) => ({ ...prev, [preguntaId]: '' }));
  };

  const handleEliminar = (preguntaId) => {
    dispatch(eliminarPregunta({ productoId, preguntaId }));
  };

  return (
    <div className="mt-5">
      <h4>Preguntas sobre este producto</h4>

      {user ? ( // Si el usuario está logueado...
        !esVendedorDelProducto && ( // ...y NO es el vendedor de este producto, puede preguntar.
          <form onSubmit={handleEnviarPregunta} className="card card-body mb-4">
            <label className="form-label fw-semibold">¿Tenés una duda? Preguntale al vendedor</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Ej: ¿Hacen envíos a todo el país?"
              value={textoPregunta}
              onChange={(e) => setTextoPregunta(e.target.value)}
              maxLength={500}
            />
            {errorPregunta && (
              <div className="alert alert-danger py-2 mt-2 mb-0">{errorPregunta}</div>
            )}
            <button type="submit" className="btn btn-primary mt-2 align-self-start" disabled={enviandoPregunta}>
              {enviandoPregunta ? 'Enviando...' : 'Preguntar'}
            </button>
          </form>
        )
      ) : (
        <p className="text-muted">Iniciá sesión para hacerle una pregunta al vendedor.</p>
      )}

      {preguntas.length === 0 ? (
        <p className="text-muted">Todavía no hay preguntas sobre este producto.</p>
      ) : (
        <ul className="list-unstyled">
          {preguntas.map((p) => (
            <li key={p.id} className="border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1">{p.texto}</p>
                  <small className="text-muted">Pregunta de <strong>{p.usuarioNombre}</strong> · {new Date(p.fechaPregunta).toLocaleDateString('es-AR')}</small>
                </div>
                {user && user.userId === p.usuarioId && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleEliminar(p.id)}
                  >Eliminar</button>
                )}
              </div>

              {p.respondida ? (
                <div className="mt-2 ps-3 border-start border-2 border-primary">
                  <p className="mb-1">{p.respuesta}</p>
                  <small className="text-muted">Respuesta del vendedor · {new Date(p.fechaRespuesta).toLocaleDateString('es-AR')}</small>
                </div>
              ) : esVendedorDelProducto ? (
                <div className="mt-2 ps-3">
                  <textarea
                    className="form-control form-control-sm"
                    rows="2"
                    placeholder="Escribí tu respuesta..."
                    value={respuestasEnCurso[p.id] || ''}
                    onChange={(e) =>
                      setRespuestasEnCurso((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-primary mt-2"
                    disabled={enviandoRespuestaId === p.id}
                    onClick={() => handleEnviarRespuesta(p.id)}
                  >
                    {enviandoRespuestaId === p.id ? 'Enviando...' : 'Responder'}
                  </button>
                </div>
              ) : (
                <p className="text-muted fst-italic mt-1 mb-0">Todavía sin responder</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Preguntas;
