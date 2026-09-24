import { FormAction, stopSubmit } from "redux-form";
import { authAPI, ResultCodeForCaptcha, ResultCodes, securityAPI } from "../api/api";
import { BaseThunkType, InferActionsTypes } from "./redux-store";

const initialState = {
  userId: null as number | null,
  email: null as string | null,
  login: null as string | null,
  isAuth: false,
  captchaUrl: null as string | null, // якщо null — капча не потрібна
};

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;

const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "SN/AUTH/SET_USER_DATA":
    case "SN/AUTH/GET_CAPTCHA_URL_SUCCESS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const actions = {
  setAuthUserData: (userId: number | null, email: string | null, login: string | null, isAuth: boolean) =>
    ({ type: "SN/AUTH/SET_USER_DATA", payload: { userId, email, login, isAuth } } as const),
  getCaptchaUrlSuccess: (captchaUrl: string | null) =>
    ({ type: "SN/AUTH/GET_CAPTCHA_URL_SUCCESS", payload: { captchaUrl } } as const),
};

export const getAuthUserData = (): ThunkType => async (dispatch) => {
  const data = await authAPI.me();
  if (data.resultCode === ResultCodes.Success) {
    const { id, email, login } = data.data;
    dispatch(actions.setAuthUserData(id, email, login, true));
  }
};

export const login =
  (email: string, password: string, rememberMe: boolean, captcha: string | null = null): ThunkType =>
  async (dispatch) => {
    const data = await authAPI.login(email, password, rememberMe, captcha);
    if (data.resultCode === ResultCodes.Success) {
      dispatch(actions.getCaptchaUrlSuccess(null));
      await dispatch(getAuthUserData());
    } else {
      if (data.resultCode === ResultCodeForCaptcha.CaptchaIsRequired) {
        await dispatch(getCaptchaUrl());
      }
      const message = data.messages.length > 0 ? data.messages[0] : "Some error";
      dispatch(stopSubmit("login", { _error: message }));
    }
  };

export const getCaptchaUrl = (): ThunkType => async (dispatch) => {
  const data = await securityAPI.getCaptchaUrl();
  dispatch(actions.getCaptchaUrlSuccess(data.url));
};

export const logout = (): ThunkType => async (dispatch) => {
  const data = await authAPI.logout();
  if (data.resultCode === ResultCodes.Success) {
    dispatch(actions.setAuthUserData(null, null, null, false));
  }
};

export default authReducer;
