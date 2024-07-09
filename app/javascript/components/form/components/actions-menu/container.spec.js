// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { screen, mountedComponent, fireEvent } from "test-utils";

import ActionsMenu from "./container";

describe("<Form /> - components/<ActionsMenu />", () => {
  it("renders ActionMenu with where conditions are true or not defined", () => {
    mountedComponent(
      <ActionsMenu
        actionItems={[
          { name: "test_no_condition" },
          { name: "test_condition_true", condition: true },
          { name: "test_condition_false", condition: false }
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });
});
