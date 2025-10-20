import { mountedComponent } from "test-utils";

import SelfRegistration from "./component";

describe("<SelfRegistrationSuccess />", () => {
  it("should redirect to signin if allowSelfRegistration is false or nil", async () => {
    const { history } = mountedComponent(<SelfRegistration />);

    expect(history.location.pathname).toBe("/login");
  });
});
