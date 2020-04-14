import { MenuItem } from "@material-ui/core";

import { setupMockFormComponent } from "../../../../test";

import ActionsMenu from "./container";

describe("<Form /> - components/<ActionsMenu />", () => {
  const { component } = setupMockFormComponent(ActionsMenu, {
    actionItems: [
      { name: "test_no_condition" },
      { name: "test_condition_true", condition: true },
      { name: "test_condition_false", condition: false }
    ]
  });

  it("renders ActionMenu with where conditions are true or not defined", () => {
    const menuItem = component.find(MenuItem);

    expect(menuItem).to.have.lengthOf(2);
  });
});
