import { Dispatch } from "redux";
import { APIResponseType, ResultCodes, UsersFilterType, usersAPI } from "../api/api";
import { UserType } from "../types/types";
import { BaseThunkType, InferActionsTypes } from "./redux-store";

const initialState = {
  users: [] as Array<UserType>,
  pageSize: 10,
  totalUsersCount: 0,
  currentPage: 1,
  isFetching: true,
  followingInProgress: [] as Array<number>, // масив id користувачів
  filter: { term: "", friend: null } as UsersFilterType,
};

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

const usersReducer = (state = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "SN/USERS/FOLLOW":
      return { ...state, users: state.users.map((u) => (u.id === action.userId ? { ...u, followed: true } : u)) };
    case "SN/USERS/UNFOLLOW":
      return { ...state, users: state.users.map((u) => (u.id === action.userId ? { ...u, followed: false } : u)) };
    case "SN/USERS/SET_USERS":
      return { ...state, users: action.users };
    case "SN/USERS/SET_CURRENT_PAGE":
      return { ...state, currentPage: action.currentPage };
    case "SN/USERS/SET_FILTER":
      return { ...state, filter: action.filter };
    case "SN/USERS/SET_TOTAL_USERS_COUNT":
      return { ...state, totalUsersCount: action.count };
    case "SN/USERS/TOGGLE_IS_FETCHING":
      return { ...state, isFetching: action.isFetching };
    case "SN/USERS/TOGGLE_IS_FOLLOWING_PROGRESS":
      return {
        ...state,
        followingInProgress: action.isFetching
          ? [...state.followingInProgress, action.userId]
          : state.followingInProgress.filter((id) => id !== action.userId),
      };
    default:
      return state;
  }
};

export const actions = {
  followSuccess: (userId: number) => ({ type: "SN/USERS/FOLLOW", userId } as const),
  unfollowSuccess: (userId: number) => ({ type: "SN/USERS/UNFOLLOW", userId } as const),
  setUsers: (users: Array<UserType>) => ({ type: "SN/USERS/SET_USERS", users } as const),
  setCurrentPage: (currentPage: number) => ({ type: "SN/USERS/SET_CURRENT_PAGE", currentPage } as const),
  setFilter: (filter: UsersFilterType) => ({ type: "SN/USERS/SET_FILTER", filter } as const),
  setTotalUsersCount: (count: number) => ({ type: "SN/USERS/SET_TOTAL_USERS_COUNT", count } as const),
  toggleIsFetching: (isFetching: boolean) => ({ type: "SN/USERS/TOGGLE_IS_FETCHING", isFetching } as const),
  toggleFollowingProgress: (isFetching: boolean, userId: number) =>
    ({ type: "SN/USERS/TOGGLE_IS_FOLLOWING_PROGRESS", isFetching, userId } as const),
};

export const requestUsers =
  (page: number, pageSize: number, filter: UsersFilterType): ThunkType =>
  async (dispatch) => {
    dispatch(actions.toggleIsFetching(true));
    dispatch(actions.setCurrentPage(page));
    dispatch(actions.setFilter(filter));
    try {
      const data = await usersAPI.getUsers(page, pageSize, filter);
      dispatch(actions.setUsers(data.items));
      dispatch(actions.setTotalUsersCount(data.totalCount));
    } finally {
      dispatch(actions.toggleIsFetching(false));
    }
  };

const followUnfollowFlow = async (
  dispatch: Dispatch<ActionsType>,
  userId: number,
  apiMethod: (userId: number) => Promise<APIResponseType>,
  actionCreator: (userId: number) => ActionsType
) => {
  dispatch(actions.toggleFollowingProgress(true, userId));
  try {
    const data = await apiMethod(userId);
    if (data.resultCode === ResultCodes.Success) {
      dispatch(actionCreator(userId));
    }
  } finally {
    dispatch(actions.toggleFollowingProgress(false, userId));
  }
};

export const follow = (userId: number): ThunkType => async (dispatch) => {
  await followUnfollowFlow(dispatch, userId, usersAPI.follow, actions.followSuccess);
};

export const unfollow = (userId: number): ThunkType => async (dispatch) => {
  await followUnfollowFlow(dispatch, userId, usersAPI.unfollow, actions.unfollowSuccess);
};

export default usersReducer;
