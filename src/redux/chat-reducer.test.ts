import chatReducer, { actions } from "./chat-reducer";

it("appends received messages with unique ids and caps history", () => {
  const initial = chatReducer(undefined, { type: "@@INIT" } as any);
  const msgs = Array.from({ length: 120 }, (_, i) => ({
    message: `m${i}`,
    photo: null,
    userId: i,
    userName: `u${i}`,
  }));
  const state = chatReducer(initial, actions.messagesReceived(msgs));
  expect(state.messages.length).toBe(100);
  expect(state.messages[99].message).toBe("m119");
  expect(new Set(state.messages.map((m) => m.id)).size).toBe(100);
});

it("changes status", () => {
  const state = chatReducer(undefined, actions.statusChanged("ready"));
  expect(state.status).toBe("ready");
});
