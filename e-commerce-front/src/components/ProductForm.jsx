import { useState, useEffect } from 'react';
import api from '../services/api';

function ProductForm({ product, onSaved, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descuento, setDescuento] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [talle, setTalle] = useState('');
  const [color, setColor] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      } catch {
        // La carga de categorias muestra el formulario igual; el backend valida al guardar.
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (product) {
      setNombre(product.nombre || '');
      setDescripcion(product.descripcion || '');
      setPrecio(product.precio || '');
      setStock(product.stock || '');
      setDescuento(product.descuento || '');
      setImagenUrl(product.imagenUrl || '');
      setTalle(product.talle || '');
      setColor(product.color || '');
      setCategoriaId(product.categoriaId || '');
    } else {
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
      setDescuento('');
      setImagenUrl('');
      setTalle('');
      setColor('');
      setCategoriaId('');
    }
  }, [product]);

  const getErrorMessage = (err) => {
    const data = err.response?.data;
    return (typeof data === 'string' ? data : data?.message) || 'Error al guardar el producto';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const body = {
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      descuento: descuento ? Number(descuento) : null,
      imagenUrl: imagenUrl || null,
      talle: talle || null,
      color: color || null,
      categoriaId: categoriaId ? Number(categoriaId) : null,
    };

    const url = product ? `/productos/${product.id}` : `/productos`;
    const request = product ? api.put(url, body) : api.post(url, body);

    try {
      const response = await request;
      const saved = response.data;
      if (onSaved) onSaved(saved);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h4 className="mb-3">{product ? 'Editar Producto' : 'Nuevo Producto'}</h4>

      <div className="mb-2">
        <label className="form-label">Nombre *</label>
        <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>

      <div className="mb-2">
        <label className="form-label">Descripcion *</label>
        <textarea className="form-control" rows={2} maxLength={255} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>

      <div className="row">
        <div className="col mb-2">
          <label className="form-label">Precio *</label>
          <input type="number" step="0.01" min="0" className="form-control" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
        </div>
        <div className="col mb-2">
          <label className="form-label">Stock *</label>
          <input type="number" min="0" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
        <div className="col mb-2">
          <label className="form-label">Descuento (%) (opcional)</label>
          <input type="number" min="0" max="100" className="form-control" value={descuento} onChange={(e) => setDescuento(e.target.value)} placeholder="Ej: 10" />
        </div>
      </div>

      <div className="mb-2">
        <label className="form-label">URL de imagen *</label>
        <input className="form-control" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} placeholder="https://..." required/>
      </div>

      <div className="row">
        <div className="col mb-2">
          <label className="form-label">Talle *</label>
          <input className="form-control" value={talle} onChange={(e) => setTalle(e.target.value)} placeholder="S, M, L, XL..." required/>
        </div>
        <div className="col mb-2">
          <label className="form-label">Color *</label>
          <input className="form-control" value={color} onChange={(e) => setColor(e.target.value)} required/>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Categoria *</label>
        <select className="form-select" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
          <option value="">Seleccione una categoria...</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
