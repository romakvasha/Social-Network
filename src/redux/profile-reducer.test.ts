import profileReducer, { actions, InitialStateType } from "./profile-reducer";

const state: InitialStateType = {
  postData: [
    { id: 1, message: "Привіт, як справи?", likesCount: 12 },
    { id: 2, message: "Це мій перший пост", likesCount: 5 },
  ],
  profile: null,
  status: "",
};

it("додається новий пост", () => {
  const newState = profileReducer(state, actions.addPost("Новий пост"));
  expect(newState.postData.length).toBe(3);
  expect(newState.postData[2].message).toBe("Новий пост");
  expect(newState.postData[2].likesCount).toBe(0);
});

it("пост видаляється", () => {
  const newState = profileReducer(state, actions.deletePost(1));
  expect(newState.postData.length).toBe(1);
});

it("видалення неіснуючого поста не змінює список", () => {
  const newState = profileReducer(state, actions.deletePost(1000));
  expect(newState.postData.length).toBe(2);
});

it("лайк збільшує лічильник", () => {
  const newState = profileReducer(state, actions.likePost(2));
  expect(newState.postData[1].likesCount).toBe(6);
});
