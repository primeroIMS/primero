import { MenuItem } from "@material-ui/core";

import { expect, setupMockFormComponent } from "../../../../test";

import ActionsMenu from "./container";

describe("<Form /> - components/<ActionsMenu />", () => {
  const { component } = setupMockFormComponent(ActionsMenu, {
    actionItems: [{ name: "test_action_1" }]
  });

  it("renders ActionMenu with one action", () => {
    const menuItem = component.find(MenuItem)
    expect(menuItem).to.have.lengthOf(1);
  });
});
