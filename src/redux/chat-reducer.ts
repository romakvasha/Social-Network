import { Dispatch } from "redux";
import { chatAPI, ChatStatusType } from "../api/chat-api";
import { ChatMessageType } from "../types/types";
import { BaseThunkType, InferActionsTypes } from "./redux-store";

// Сервер не присилає id повідомлень — генеруємо свій для ключів у списку
export type ChatMessageWithIdType = ChatMessageType & { id: string };

const MAX_MESSAGES = 100;

const initialState = {
  messages: [] as Array<ChatMessageWithIdType>,
  status: "pending" as ChatStatusType,
};

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

let idCounter = 0;

const chatReducer = (state = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "SN/CHAT/MESSAGES_RECEIVED":
      return {
        ...state,
        messages: [
          ...state.messages,
          ...action.payload.messages.map((m) => ({ ...m, id: String(++idCounter) })),
        ].slice(-MAX_MESSAGES),
      };
    case "SN/CHAT/STATUS_CHANGED":
      return { ...state, status: action.payload.status };
    case "SN/CHAT/CLEAR":
      return { ...state, messages: [] };
    default:
      return state;
  }
};

export const actions = {
  messagesReceived: (messages: Array<ChatMessageType>) =>
    ({ type: "SN/CHAT/MESSAGES_RECEIVED", payload: { messages } } as const),
  statusChanged: (status: ChatStatusType) => ({ type: "SN/CHAT/STATUS_CHANGED", payload: { status } } as const),
  clear: () => ({ type: "SN/CHAT/CLEAR" } as const),
};

export const startMessagesListening = (): ThunkType => async (dispatch) => {
  dispatch(actions.clear());
  chatAPI.subscribe("messages-received", (messages) => dispatch(actions.messagesReceived(messages)));
  chatAPI.subscribe("status-changed", (status) => dispatch(actions.statusChanged(status)));
  chatAPI.start();
};

export const stopMessagesListening = (): ThunkType => async (_dispatch: Dispatch) => {
  chatAPI.stop();
};

export const sendMessage = (message: string): ThunkType => async () => {
  chatAPI.sendMessage(message);
};

export default chatReducer;
