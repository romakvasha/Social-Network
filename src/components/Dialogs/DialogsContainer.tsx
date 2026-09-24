import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialogs from "./Dialogs";
import { actions } from "../../redux/messages-reducer";
import { withAuthRedirect } from "../../hoc/withAuthRedirect";
import { AppStateType } from "../../redux/redux-store";

const DialogsContainer: React.FC = () => {
  const messagesPage = useSelector((state: AppStateType) => state.messagesPage);
  const dispatch = useDispatch();
  return (
    <Dialogs
      messagesPage={messagesPage}
      addMessage={(newMessageBody) => dispatch(actions.addMessage(newMessageBody))}
    />
  );
};

export default withAuthRedirect(DialogsContainer);
