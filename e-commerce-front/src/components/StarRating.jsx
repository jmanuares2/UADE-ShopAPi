import { useState } from 'react';

/**
 * Componente de estrellas.
 * - Modo lectura (readOnly): sólo muestra el puntaje, se usa para listar reseñas o promedios.
 * - Modo interactivo: el usuario puede tocar/clickear una estrella para elegir puntaje (1 a 5).
 */
function StarRating({ value = 0, onChange, readOnly = false, size = 22 }) {
  const [hoverValue, setHoverValue] = useState(0);

  const estrellas = [1, 2, 3, 4, 5];
  const valorMostrado = hoverValue || value;

  return (
    <div
      className="d-inline-flex"
      style={{ gap: '2px', cursor: readOnly ? 'default' : 'pointer' }}
      onMouseLeave={() => setHoverValue(0)}
    >
      {estrellas.map((estrella) => (
        <span
          key={estrella}
          onClick={() => !readOnly && onChange?.(estrella)}
          onMouseEnter={() => !readOnly && setHoverValue(estrella)}
          style={{
            fontSize: size,
            lineHeight: 1,
            color: estrella <= valorMostrado ? '#f5b301' : '#d9d9d9',
            transition: 'color 0.15s ease-in-out',
          }}
          aria-label={`${estrella} estrella${estrella > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
