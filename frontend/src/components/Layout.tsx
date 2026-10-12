import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link bg-transparent border-0 ${isActive ? 'active fw-bold' : ''}`;

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* 🧭 BARRA DE NAVEGACIÓN BOOTSTRAP (SISTEMA DE PESTAÑAS INTEGRADO) */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          
          {/* Logo / Título */}
          <NavLink
            to="/"
            className="navbar-brand fw-bold bg-transparent border-0 d-flex align-items-center"
          >
            <span className="me-2">🤖</span> AI-Multi-Agent-RAG-Assistant
          </NavLink>

          {/* Menú de Opciones */}
          <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={navLinkClass}
                >
                  💬 Chat
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/upload"
                  className={navLinkClass}
                >
                  📁 Cargar
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/documents"
                  className={navLinkClass}
                >
                  📄 Biblioteca
                </NavLink>
              </li>
            </ul>
          </div>

        </div>
      </nav>

      {/* 📥 INYECCIÓN FORZOSA DEL CONTENIDO CENTRAL */}
      <main className="flex-grow-1">
        <div className="fade-in">
          <Outlet />
        </div>
      </main>

      {/* 📝 PIE DE PÁGINA */}
      <footer className="bg-white border-top py-3 mt-auto text-center">
        <div className="container">
          <p className="text-muted mb-0 small">
            © {new Date().getFullYear()} <strong>Capstone Project</strong> — Ejecutándose localmente con <strong>Llama 3 & Ollama</strong>
          </p>
        </div>
      </footer>

    </div>
  );
}
