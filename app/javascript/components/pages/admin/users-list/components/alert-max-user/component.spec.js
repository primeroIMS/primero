// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "test-utils";

import AlertMaxUser from "./component";

describe("<AlertMaxUser /> components/pages/admin/users-list/components", () => {
  const props = {
    maximumUsers: 12,
    totalUsersEnabled: 15,
    limitUsersReached: true
  };

  it("renders a <AlertMaxUser /> component", () => {
    mountedComponent(<AlertMaxUser {...props} />);

    expect(screen.getByText("users.alerts.total_users_created")).toBeInTheDocument();
  });
});
