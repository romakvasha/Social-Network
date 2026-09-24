import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ProfileStatusHook from "./ProfileStatusHook";

describe("ProfileStatus component", () => {
  test("status from props is displayed", () => {
    render(<ProfileStatusHook status="it-kamasutra.com" updateStatus={() => {}} />);
    expect(screen.getByText("it-kamasutra.com")).toBeInTheDocument();
  });

  test("double click switches to input and blur saves new status", () => {
    const updateStatus = jest.fn();
    render(<ProfileStatusHook status="old" updateStatus={updateStatus} />);

    fireEvent.doubleClick(screen.getByText("old"));
    const input = screen.getByDisplayValue("old");
    fireEvent.change(input, { target: { value: "new" } });
    fireEvent.blur(input);

    expect(updateStatus).toHaveBeenCalledWith("new");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  test("non-owner cannot edit status", () => {
    render(<ProfileStatusHook status="read only" updateStatus={() => {}} isOwner={false} />);
    fireEvent.doubleClick(screen.getByText("read only"));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
