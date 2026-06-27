import { Link } from 'react-router-dom';

function Home() {

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
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>

        <div style={{
        minHeight: '70vh',
        background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2072&auto=format&fit=crop")',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 15%',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        }}>
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