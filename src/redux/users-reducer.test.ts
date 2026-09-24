import usersReducer, { actions, follow, InitialStateType, unfollow } from "./users-reducer";
import { usersAPI, ResultCodes } from "../api/api";

jest.mock("../api/api", () => ({
  ...jest.requireActual("../api/api"),
  usersAPI: { follow: jest.fn(), unfollow: jest.fn(), getUsers: jest.fn() },
}));
const usersAPIMock = usersAPI as jest.Mocked<typeof usersAPI>;

let state: InitialStateType;

beforeEach(() => {
  state = {
    users: [0, 1, 2].map((id) => ({
      id,
      name: `User ${id}`,
      followed: id === 2,
      photos: { small: null, large: null },
      status: "",
    })),
    pageSize: 10,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: false,
    followingInProgress: [],
    filter: { term: "", friend: null },
  };
  jest.clearAllMocks();
});

it("follow success", () => {
  const newState = usersReducer(state, actions.followSuccess(1));
  expect(newState.users[0].followed).toBeFalsy();
  expect(newState.users[1].followed).toBeTruthy();
});

it("unfollow success", () => {
  const newState = usersReducer(state, actions.unfollowSuccess(2));
  expect(newState.users[2].followed).toBeFalsy();
});

it("follow thunk dispatches progress and success actions", async () => {
  usersAPIMock.follow.mockResolvedValue({ resultCode: ResultCodes.Success, messages: [], data: {} });
  const dispatch = jest.fn();
  await follow(1)(dispatch, jest.fn(), {});

  expect(dispatch).toHaveBeenCalledTimes(3);
  expect(dispatch).toHaveBeenNthCalledWith(1, actions.toggleFollowingProgress(true, 1));
  expect(dispatch).toHaveBeenNthCalledWith(2, actions.followSuccess(1));
  expect(dispatch).toHaveBeenNthCalledWith(3, actions.toggleFollowingProgress(false, 1));
});

it("unfollow thunk resets progress even when API fails", async () => {
  usersAPIMock.unfollow.mockRejectedValue(new Error("network"));
  const dispatch = jest.fn();
  await expect(unfollow(1)(dispatch, jest.fn(), {})).rejects.toThrow("network");

  expect(dispatch).toHaveBeenLastCalledWith(actions.toggleFollowingProgress(false, 1));
});
