import { InferActionsTypes } from "./redux-store";

export type DialogType = {
  id: number
  name: string
  img: string
}
export type MessageType = {
  id: number
  message: string
}

const avatar = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Felis_silvestris_silvestris.jpg";

const initialState = {
  messages: [{ id: 1, message: "Привіт" }] as Array<MessageType>,
  dialogs: [
    { id: 1, name: "Ruslana", img: avatar },
    { id: 2, name: "Roma", img: avatar },
    { id: 3, name: "Taras", img: avatar },
    { id: 4, name: "Sergey", img: avatar },
    { id: 5, name: "Andry", img: avatar },
  ] as Array<DialogType>,
};

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;

const messagesReducer = (state = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "SN/DIALOGS/ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, { id: Date.now(), message: action.newMessageBody }],
      };
    default:
      return state;
  }
};

export const actions = {
  addMessage: (newMessageBody: string) => ({ type: "SN/DIALOGS/ADD_MESSAGE", newMessageBody } as const),
};

export default messagesReducer;
