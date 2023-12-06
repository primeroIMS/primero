// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "test-utils";

import NewUserBtn from "./component";

describe("<NewUserBtn /> components/pages/admin/users-list/components", () => {
  const props = {
    canAddUsers: true,
    totalUsersEnabled: 15,
    limitUsersReached: false
  };

  it("renders a <NewUserBtn /> component", () => {
    mountedComponent(<NewUserBtn {...props} />);
    expect(screen.getAllByTestId("action-button")).toHaveLength(1);
  });
});
