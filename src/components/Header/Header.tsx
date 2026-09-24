import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import s from "./Header.module.css";
import { logout } from "../../redux/auth-reducer";
import { AppStateType } from "../../redux/redux-store";

const Header: React.FC = () => {
  const dispatch = useDispatch<any>();
  const isAuth = useSelector((state: AppStateType) => state.auth.isAuth);
  const login = useSelector((state: AppStateType) => state.auth.login);

  return (
    <header className={s.header}>
      <span className={s.logo}>Social Network</span>
      <div className={s.loginBlock}>
        {isAuth ? (
          <div>
            {login} <button onClick={() => dispatch(logout())}>Log out</button>
          </div>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
