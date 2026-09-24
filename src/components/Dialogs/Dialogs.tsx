import React from "react";
import { useDispatch } from "react-redux";
import { InjectedFormProps, reduxForm, reset } from "redux-form";
import s from "./Dialogs.module.css";
import DialogItem from "./DialogItem/DialogsItem";
import Message from "./Message/Message";
import { createField, Textarea } from "../common/FormsControls/FormsControls";
import { maxLengthCreator, required } from "../../utils/validators/validators";
import { InitialStateType } from "../../redux/messages-reducer";

type PropsType = {
  messagesPage: InitialStateType
  addMessage: (newMessageBody: string) => void
};

type NewMessageFormValuesType = {
  newMessageBody: string
};

const Dialogs: React.FC<PropsType> = ({ messagesPage, addMessage }) => {
  const dispatch = useDispatch();
  const { dialogs, messages } = messagesPage;

  const addNewMessage = (values: NewMessageFormValuesType) => {
    addMessage(values.newMessageBody);
    dispatch(reset("dialogAddMessageForm"));
  };

  return (
    <div className={s.dialogs}>
      <div className={s.dialogsItems}>
        {dialogs.map((d) => (
          <DialogItem item={d} key={d.id} />
        ))}
      </div>
      <div className={s.messages}>
        <div>
          {messages.map((m) => (
            <Message item={m} key={m.id} />
          ))}
        </div>
        <AddMessageFormRedux onSubmit={addNewMessage} />
      </div>
    </div>
  );
};

const maxLength100 = maxLengthCreator(100);

const AddMessageForm: React.FC<InjectedFormProps<NewMessageFormValuesType>> = ({ handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      {createField<keyof NewMessageFormValuesType>(
        "Enter your message",
        "newMessageBody",
        [required, maxLength100],
        Textarea
      )}
      <div>
        <button>Send</button>
      </div>
    </form>
  );
};

const AddMessageFormRedux = reduxForm<NewMessageFormValuesType>({ form: "dialogAddMessageForm" })(AddMessageForm);

export default Dialogs;
