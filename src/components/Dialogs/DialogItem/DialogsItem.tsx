import React from "react";
import { NavLink } from "react-router-dom";
import s from "./DialogsItem.module.css";
import { DIALOGS } from "../../NavBar/constants";
import { DialogType } from "../../../redux/messages-reducer";

type PropsType = {
  item: DialogType
};

const DialogItem: React.FC<PropsType> = ({ item }) => {
  const { img, name, id } = item;
  return (
    <div className={s.dialog}>
      <img src={img} alt="аватарка" />
      <NavLink to={`${DIALOGS}/${id}`} activeClassName={s.active}>
        {name}
      </NavLink>
    </div>
  );
};

export default DialogItem;
