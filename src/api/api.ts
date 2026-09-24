import axios from "axios";
import { PhotosType, ProfileType, UserType } from "../types/types";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "https://social-network.samuraijs.com/api/1.0/",
  headers: { "API-KEY": "c8a462de-b11f-4b2e-be51-ab003e93d29e" },
});

export enum ResultCodes {
  Success = 0,
  Error = 1,
}

export enum ResultCodeForCaptcha {
  CaptchaIsRequired = 10,
}

export type APIResponseType<D = {}, RC = ResultCodes> = {
  data: D
  messages: Array<string>
  resultCode: RC
}

export type GetItemsType = {
  items: Array<UserType>
  totalCount: number
  error: string | null
}

export type UsersFilterType = {
  term: string
  friend: null | boolean
}

export const usersAPI = {
  getUsers(currentPage = 1, pageSize = 10, filter: UsersFilterType = { term: "", friend: null }) {
    const params = new URLSearchParams({
      page: String(currentPage),
      count: String(pageSize),
    });
    if (filter.term) params.append("term", filter.term);
    if (filter.friend !== null) params.append("friend", String(filter.friend));
    return instance.get<GetItemsType>(`users?${params}`).then((res) => res.data);
  },
  follow(userId: number) {
    return instance.post<APIResponseType>(`follow/${userId}`).then((res) => res.data);
  },
  unfollow(userId: number) {
    return instance.delete<APIResponseType>(`follow/${userId}`).then((res) => res.data);
  },
};

type MeResponseDataType = {
  id: number
  email: string
  login: string
}

type LoginResponseDataType = {
  userId: number
}

export const authAPI = {
  me() {
    return instance.get<APIResponseType<MeResponseDataType>>(`auth/me`).then((res) => res.data);
  },
  login(email: string, password: string, rememberMe = false, captcha: string | null = null) {
    return instance
      .post<APIResponseType<LoginResponseDataType, ResultCodes | ResultCodeForCaptcha>>(`auth/login`, {
        email,
        password,
        rememberMe,
        captcha,
      })
      .then((res) => res.data);
  },
  logout() {
    return instance.delete<APIResponseType>(`auth/login`).then((res) => res.data);
  },
};

type GetCaptchaUrlResponseType = {
  url: string
}

export const securityAPI = {
  getCaptchaUrl() {
    return instance.get<GetCaptchaUrlResponseType>(`security/get-captcha-url`).then((res) => res.data);
  },
};

type SavePhotoResponseDataType = {
  photos: PhotosType
}

export const profileAPI = {
  getProfile(userId: number) {
    return instance.get<ProfileType>(`profile/${userId}`).then((res) => res.data);
  },
  getStatus(userId: number) {
    return instance.get<string>(`profile/status/${userId}`).then((res) => res.data);
  },
  updateStatus(status: string) {
    return instance.put<APIResponseType>(`profile/status`, { status }).then((res) => res.data);
  },
  savePhoto(photoFile: File) {
    const formData = new FormData();
    formData.append("image", photoFile);
    return instance
      .put<APIResponseType<SavePhotoResponseDataType>>(`profile/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
  saveProfile(profile: ProfileType) {
    return instance.put<APIResponseType>(`profile`, profile).then((res) => res.data);
  },
};
