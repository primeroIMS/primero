// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../test-utils";

import AdminNavItem from "./admin-nav-item";

describe("<AdminNavItem />", () => {
  describe("when the user has access to admin-nav-item entry", () => {
    const props = {
      item: {
        label: "Users",
        to: "/users"
      },
      renderJewel: true
    };

    it("should render a Jewel component", () => {
      mountedComponent(<AdminNavItem {...props} />);
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });
  });
});
