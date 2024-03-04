import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import Account from "./container";

describe("<Account />", () => {
  beforeEach(() => {
    const initialState = fromJS({
      user: {
        loading: false,
        errors: false,
        serverErrors: [],
        locale: "en",
        id: 1,
        full_name: "Test user",
        disabled: false,
        email: "primero@primero.com",
        time_zone: "UTC",
        user_name: "primero"
      },
      application: {
        agencies: [{ id: 1, unique_id: "agency-unicef", name: "UNICEF" }]
      }
    });

    mountedComponent(<Account />, initialState, { mode: "edit" }, ["/account"]);
  });

  it("renders record form", () => {
    expect(document.querySelector("#account-form")).toBeInTheDocument();
  });

  it("renders heading with action buttons", () => {
    expect(screen.getByText("Test user")).toBeInTheDocument();
  });
});
