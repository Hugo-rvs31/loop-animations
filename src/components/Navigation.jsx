import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  return (
    <nav className="navigation">
      {isHome ? (
        // 👉 Quand on est sur Home
        <div className="nav-links">
          <NavLink
            to="/balls-circle"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Balls Circle
          </NavLink>

          {/* plus tard tu pourras ajouter d'autres pages ici */}
          {/* <NavLink to="/page2">Page 2</NavLink> */}
        </div>
      ) : (
        // 👉 Quand on est sur une autre page
        <button className="nav-back" onClick={() => navigate("/")}>
          ← Retour à l’accueil
        </button>
      )}
    </nav>
  );
};

export default Navigation;
