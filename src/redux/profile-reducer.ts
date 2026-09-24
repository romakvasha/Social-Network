import { FormAction, stopSubmit } from "redux-form";
import { profileAPI, ResultCodes } from "../api/api";
import { PhotosType, PostType, ProfileType } from "../types/types";
import { BaseThunkType, InferActionsTypes } from "./redux-store";

const initialState = {
  postData: [{ id: 1, message: "Привіт, як справи?", likesCount: 12 }] as Array<PostType>,
  profile: null as ProfileType | null,
  status: "",
};

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;

const profileReducer = (state = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "SN/PROFILE/ADD_POST":
      return {
        ...state,
        postData: [...state.postData, { id: Date.now(), message: action.newPostBody, likesCount: 0 }],
      };
    case "SN/PROFILE/DELETE_POST":
      return { ...state, postData: state.postData.filter((p) => p.id !== action.postId) };
    case "SN/PROFILE/LIKE_POST":
      return {
        ...state,
        postData: state.postData.map((p) => (p.id === action.postId ? { ...p, likesCount: p.likesCount + 1 } : p)),
      };
    case "SN/PROFILE/SET_USER_PROFILE":
      return { ...state, profile: action.profile };
    case "SN/PROFILE/SET_STATUS":
      return { ...state, status: action.status };
    case "SN/PROFILE/SAVE_PHOTO_SUCCESS":
      return { ...state, profile: { ...state.profile, photos: action.photos } as ProfileType };
    default:
      return state;
  }
};

export const actions = {
  addPost: (newPostBody: string) => ({ type: "SN/PROFILE/ADD_POST", newPostBody } as const),
  deletePost: (postId: number) => ({ type: "SN/PROFILE/DELETE_POST", postId } as const),
  likePost: (postId: number) => ({ type: "SN/PROFILE/LIKE_POST", postId } as const),
  setUserProfile: (profile: ProfileType) => ({ type: "SN/PROFILE/SET_USER_PROFILE", profile } as const),
  setStatus: (status: string) => ({ type: "SN/PROFILE/SET_STATUS", status } as const),
  savePhotoSuccess: (photos: PhotosType) => ({ type: "SN/PROFILE/SAVE_PHOTO_SUCCESS", photos } as const),
};

export const getUserProfile = (userId: number): ThunkType => async (dispatch) => {
  const data = await profileAPI.getProfile(userId);
  dispatch(actions.setUserProfile(data));
};

export const getStatus = (userId: number): ThunkType => async (dispatch) => {
  const data = await profileAPI.getStatus(userId);
  dispatch(actions.setStatus(data ?? ""));
};

export const updateStatus = (status: string): ThunkType => async (dispatch) => {
  const data = await profileAPI.updateStatus(status);
  if (data.resultCode === ResultCodes.Success) {
    dispatch(actions.setStatus(status));
  }
};

export const savePhoto = (file: File): ThunkType => async (dispatch) => {
  const data = await profileAPI.savePhoto(file);
  if (data.resultCode === ResultCodes.Success) {
    dispatch(actions.savePhotoSuccess(data.data.photos));
  }
};

export const saveProfile = (profile: ProfileType): ThunkType => async (dispatch, getState) => {
  const userId = getState().auth.userId;
  const data = await profileAPI.saveProfile(profile);
  if (data.resultCode === ResultCodes.Success) {
    if (userId !== null) {
      await dispatch(getUserProfile(userId));
    }
  } else {
    const message = data.messages[0] ?? "Some error";
    dispatch(stopSubmit("edit-profile", { _error: message }));
    return Promise.reject(message);
  }
};

export default profileReducer;
