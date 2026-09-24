const initialState = {
  navFriends: [
    {
      name: "Ruslana",
      img: "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      alt: "Аватар",
    },
    { name: "Roma", img: "https://crosti.ru/patterns/00/09/59/dc0d3fd8fa/picture.jpg", alt: "Аватар" },
    { name: "Taras", img: "https://crosti.ru/patterns/00/09/59/dc0d3fd8fa/picture.jpg", alt: "Аватар" },
  ],
};

type InitialStateType = typeof initialState;

const navReducer = (state = initialState, action: { type: string }): InitialStateType => state;

export default navReducer;
