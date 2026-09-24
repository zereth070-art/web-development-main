import { NavLink } from "react-router";
import OffCanvasCat from "./offCanvasCategorias/offcamvascat.jsx";
import "./header.css";

function Header() {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <OffCanvasCat />
        <span className="navbar-brand fw-bold ms-2">PCCOMPONENTES</span>
        <nav>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Cliente/LoginRegistro">
                Identifícate
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;