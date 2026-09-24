import React from "react";
import { NavLink } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="page">
      <h2>404 — сторінку не знайдено</h2>
      <NavLink to="/profile">На головну</NavLink>
    </div>
  );
};

export default NotFound;
