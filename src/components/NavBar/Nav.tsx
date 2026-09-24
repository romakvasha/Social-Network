import React from "react";
import { NavLink } from "react-router-dom";
import s from "./Nav.module.css";
import { CHAT, DIALOGS, FINDUSERS, MUSIC, NEWS, PROFILE, SETTINGS } from "./constants";

const links = [
  { to: PROFILE, title: "Profile" },
  { to: DIALOGS, title: "Messages" },
  { to: CHAT, title: "Chat" },
  { to: NEWS, title: "News" },
  { to: MUSIC, title: "Music" },
  { to: SETTINGS, title: "Settings" },
];

const Nav: React.FC = () => {
  return (
    <nav className={s.nav}>
      {links.map((l) => (
        <div className={s.item} key={l.to}>
          <NavLink to={l.to} activeClassName={s.active}>
            {l.title}
          </NavLink>
        </div>
      ))}
      <div className={s.friendsBarItems}>
        <NavLink to={FINDUSERS} activeClassName={s.active}>
          <h5>Find Users</h5>
        </NavLink>
      </div>
    </nav>
  );
};

export default Nav;
