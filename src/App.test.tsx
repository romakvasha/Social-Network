import React from "react";
import { act, render, screen } from "@testing-library/react";
import MainApp from "./App";
import { authAPI } from "./api/api";

jest.mock("./api/api", () => ({
  ...jest.requireActual("./api/api"),
  authAPI: { me: jest.fn(), login: jest.fn(), logout: jest.fn() },
}));
const authAPIMock = authAPI as jest.Mocked<typeof authAPI>;

it("renders login link for anonymous user", async () => {
  authAPIMock.me.mockResolvedValue({ resultCode: 1, messages: [], data: {} as any });
  await act(async () => {
    render(<MainApp />);
  });
  expect(await screen.findByText("Login", { selector: "a" })).toBeInTheDocument();
});

it("shows global error when server is unreachable", async () => {
  authAPIMock.me.mockRejectedValue(new Error("Network Error"));
  await act(async () => {
    render(<MainApp />);
  });
  expect(await screen.findByRole("alert")).toHaveTextContent("Не вдалося з'єднатися з сервером");
});
