import React from "react";
import s from "../Dialogs.module.css";
import { MessageType } from "../../../redux/messages-reducer";

type PropsType = {
  item: MessageType
};

const Message: React.FC<PropsType> = ({ item }) => {
  return <div className={s.message}>{item.message}</div>;
};

export default Message;
