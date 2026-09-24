import React from "react";
import { create } from "react-test-renderer";
import Paginator from "./Paginator";

describe("Paginator component tests", () => {
  test("pages count is 11 but should be showed only 10", () => {
    const component = create(
      <Paginator totalItemsCount={11} pageSize={1} portionSize={10} currentPage={1} onPageChanged={() => {}} />
    );
    expect(component.root.findAllByType("span").length).toBe(10);
  });

  test("if pages count is more then 10 button NEXT should be present", () => {
    const component = create(
      <Paginator totalItemsCount={11} pageSize={1} portionSize={10} currentPage={1} onPageChanged={() => {}} />
    );
    const buttons = component.root.findAllByType("button");
    expect(buttons.length).toBe(1);
    expect(buttons[0].children).toEqual(["NEXT"]);
  });

  test("shows the portion that contains the current page", () => {
    const component = create(
      <Paginator totalItemsCount={25} pageSize={1} portionSize={10} currentPage={15} onPageChanged={() => {}} />
    );
    const pages = component.root.findAllByType("span").map((s) => s.children[0]);
    expect(pages[0]).toBe("11");
  });
});
