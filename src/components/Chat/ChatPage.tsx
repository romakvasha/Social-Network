import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import s from "./ChatPage.module.css";
import usersPhoto from "../../assets/images/usersPhoto.jpg";
import { sendMessage, startMessagesListening, stopMessagesListening } from "../../redux/chat-reducer";
import { AppStateType } from "../../redux/redux-store";
import { ChatMessageType } from "../../types/types";
import { withAuthRedirect } from "../../hoc/withAuthRedirect";

const ChatPage: React.FC = () => {
  return (
    <div className="page">
      <h2>Загальний чат</h2>
      <Chat />
    </div>
  );
};

const Chat: React.FC = () => {
  const dispatch = useDispatch<any>();
  const status = useSelector((state: AppStateType) => state.chat.status);

  useEffect(() => {
    dispatch(startMessagesListening());
    return () => {
      dispatch(stopMessagesListening());
    };
  }, [dispatch]);

  return (
    <div>
      {status === "error" && <div className={s.error}>Помилка з'єднання. Спробуйте оновити сторінку.</div>}
      {status === "pending" && <div className={s.pending}>З'єднання...</div>}
      <Messages />
      <AddMessageForm />
    </div>
  );
};

const Messages: React.FC = () => {
  const messages = useSelector((state: AppStateType) => state.chat.messages);
  const messagesAnchorRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const nearBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 300;
    setIsAutoScrollActive(nearBottom);
  };

  useEffect(() => {
    if (isAutoScrollActive) {
      messagesAnchorRef.current?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [messages, isAutoScrollActive]);

  return (
    <div className={s.messages} onScroll={scrollHandler}>
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      <div ref={messagesAnchorRef} />
    </div>
  );
};

const Message: React.FC<{ message: ChatMessageType }> = React.memo(({ message }) => {
  return (
    <div className={s.message}>
      <NavLink to={`/profile/${message.userId}`}>
        <img src={message.photo || usersPhoto} alt={message.userName} />
      </NavLink>
      <div>
        <b>{message.userName}</b>
        <div className={s.text}>{message.message}</div>
      </div>
    </div>
  );
});

const AddMessageForm: React.FC = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<any>();
  const status = useSelector((state: AppStateType) => state.chat.status);

  const sendMessageHandler = () => {
    if (!message.trim()) return;
    dispatch(sendMessage(message.trim()));
    setMessage("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  return (
    <div className={s.form}>
      <textarea
        onChange={(e) => setMessage(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        value={message}
        placeholder="Напишіть повідомлення (Enter — надіслати)"
      />
      <button disabled={status !== "ready"} onClick={sendMessageHandler}>
        Send
      </button>
    </div>
  );
};

export default withAuthRedirect(ChatPage);
