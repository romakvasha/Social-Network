import { getAuthUserData } from "./auth-reducer";
import { BaseThunkType, InferActionsTypes } from "./redux-store";

const initialState = {
  initialized: false,
  globalError: null as string | null,
};

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;

const appReducer = (state = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "SN/APP/INITIALIZED_SUCCESS":
      return { ...state, initialized: true };
    case "SN/APP/SET_GLOBAL_ERROR":
      return { ...state, globalError: action.error };
    default:
      return state;
  }
};

export const actions = {
  initializedSuccess: () => ({ type: "SN/APP/INITIALIZED_SUCCESS" } as const),
  setGlobalError: (error: string | null) => ({ type: "SN/APP/SET_GLOBAL_ERROR", error } as const),
};

export const initializeApp = (): BaseThunkType<ActionsType> => async (dispatch) => {
  try {
    await dispatch(getAuthUserData());
  } catch (e) {
    // Навіть якщо сервер недоступний — показуємо застосунок, а не вічний прелоадер
    dispatch(actions.setGlobalError("Не вдалося з'єднатися з сервером"));
  }
  dispatch(actions.initializedSuccess());
};

export default appReducer;
