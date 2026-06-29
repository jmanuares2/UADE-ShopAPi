import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import ProductCard from './ProductCard';
import { fetchFavorites } from '../store/favoritesSlice';
// Importa tu video
import heroVideo from '../assets/video.mp4';
import enzoImg from '../assets/enzo.png';

function Home() {
  const dispatch = useDispatch();
  const [productosNuevos, setProductosNuevos] = useState([]);
  const [productosOfertas, setProductosOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchFavorites());
    const cargarProductos = async () => {
      try {
        const res = await api.get('/productos');
        const lista = res.data || [];
        const disponibles = lista.filter(p => p.stock > 0);
        const aOrdenar = disponibles.length > 0 ? disponibles : lista;
        
        aOrdenar.sort((a, b) => {
          const fechaA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
          const fechaB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
          return fechaB - fechaA;
        });

        setProductosNuevos(aOrdenar.slice(0, 4));

        const conDescuento = disponibles.filter(p => p.descuento && p.descuento > 0);
        setProductosOfertas(conDescuento.slice(0, 4));
      } catch (err) {
        console.error("Error cargando productos nuevos:", err);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, [dispatch]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap');
        .home-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5) !important;
          transform: translateY(-2px);
        }
        .home-btn:active {
          background: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.9) !important;
          transform: translateY(0);
        }
        .benefit-card:hover {
          box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
          transform: translateY(-8px);
        }
        .see-more-arrow:hover {
          background: #111 !important;
          color: #fff !important;
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>

        <div style={{
        minHeight: '70vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        position: 'relative', // Para posicionar el video como fondo
        overflow: 'hidden', // Para que el video no se salga
        }}>
          {/* Video de fondo */}
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Ajusta el video para cubrir todo el espacio
              zIndex: -1, // Pone el video detrás del contenido
              opacity: 0.8, // Ajusta la opacidad si quieres
            }}
          >
            <source src={heroVideo} type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          {/* Overlay oscuro para que el texto sea legible */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: -1,
          }}></div>
          <p style={{ fontSize: 14, fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 24 }}>
            Encontrá lo que buscás
          </p>
          <Link
            to="/productos"
            className="home-btn"
            style={{
              background: 'transparent',
              color: '#fff',
              border: '2px solid #fff',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '14px 44px',
              textDecoration: 'none',
              borderRadius: 4,
              transition: 'all 0.25s',
            }}
          >
            Comprar ahora
          </Link>
        </div>

        {/* Sección Descubre lo nuevo */}
        <div style={{ background: '#fff', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Descubre lo nuevo
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', overflowX: 'auto', paddingBottom: '16px' }}>
              {loading ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '48px 0' }}>
                  <div className="spinner-border text-dark" role="status"></div>
                </div>
              ) : productosNuevos.length === 0 ? (
                <p style={{ color: '#666' }}>No hay productos disponibles en este momento.</p>
              ) : (
                <>
                  {productosNuevos.map(producto => (
                    <div key={producto.id} style={{ flex: '0 0 calc(25% - 15px)', minWidth: '240px' }}>
                      <ProductCard product={producto} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link
                      to="/productos"
                      className="see-more-arrow"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        background: '#fff',
                        border: '1px solid #111',
                        color: '#111',
                        textDecoration: 'none',
                        fontSize: '24px',
                        transition: 'all 0.25s ease',
                      }}
                      title="Ver todos los productos"
                    >
                      →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Banner de Ofertas */}
        <div style={{ background: '#fff', padding: '0 24px 32px 24px' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <Link to="/productos?descuento=true">
              <img
                src={enzoImg}
                alt="50% OFF en la tercera unidad"
                style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'cover', maxHeight: '520px' }}
              />
            </Link>
          </div>
        </div>

        {/* Sección Ofertas */}
        {productosOfertas.length > 0 && (
          <div style={{ background: '#fff', padding: '16px 24px 64px 24px' }}>
            <div style={{ maxWidth: 1300, margin: '0 auto' }}>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ofertas imperdibles
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', overflowX: 'auto', paddingBottom: '16px' }}>
                {productosOfertas.map(producto => (
                  <div key={producto.id} style={{ flex: '0 0 calc(25% - 15px)', minWidth: '240px' }}>
                    <ProductCard product={producto} />
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Link
                    to="/productos?descuento=true"
                    className="see-more-arrow"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '64px',
                      height: '64px',
                      background: '#fff',
                      border: '1px solid #111',
                      color: '#111',
                      textDecoration: 'none',
                      fontSize: '24px',
                      transition: 'all 0.25s ease',
                    }}
                    title="Ver todas las ofertas"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: '#f8f8f8', padding: '48px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { 
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>, 
                title: 'Envío gratis', desc: 'En compras mayores a $30.000' 
              },
              { 
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>, 
                title: 'Compra Segura', desc: 'Máxima seguridad al realizar tu compra' 
              },
              { 
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>, 
                title: 'Devoluciones', desc: '30 días para cambiar tu producto' 
              },
            ].map(({ icon, title, desc }, index) => (
              <div
                key={index}
                className="benefit-card"
                style={{ background: '#fff', borderRadius: 8, padding: '28px 20px', textAlign: 'center', transition: 'all 0.3s ease' }}
              >
                <span style={{ display: 'block', marginBottom: 16, color: '#222' }}>{icon}</span>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#111' }}>{title}</h4>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#111', color: '#fff', padding: '18px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, opacity: 0.4, letterSpacing: '0.06em' }}>© 2026 UADE Shop — Todos los derechos reservados</p>
        </div>

      </div>
    </>
  );
}

export default Home;