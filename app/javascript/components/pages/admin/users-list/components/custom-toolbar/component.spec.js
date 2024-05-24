// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "test-utils";

import CustomToolbar from "./component";

describe("<CustomToolbar /> components/pages/admin/users-list/components", () => {
  const props = {
    displayData: ["sample"],
    maximumUsers: 12,
    totalUsersEnabled: 15,
    limitUsersReached: false
  };

  it("renders a <CustomToolbar /> component", () => {
    mountedComponent(<CustomToolbar {...props} />);

    expect(screen.getByText("users.alerts.total_users_created")).toBeInTheDocument();
  });
});
