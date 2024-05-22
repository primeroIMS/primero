// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

  describe("when WEBPUSH is enabled", () => {
    const props = { mode: "'edit'" };

    const state = fromJS({
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
        agencies: [{ id: 1, unique_id: "agency-unicef", name: "UNICEF" }],
        webpush: {
          enabled: true
        }
      }
    });

    it("renders 25 fields", () => {
      mountedComponent(<Account {...props} />, state, {}, ["/account"]);
      expect(screen.getAllByTestId("form-section-field")).toHaveLength(21);
    });
  });

  describe("when WEBPUSH is disabled", () => {
    const props = { mode: "'edit'" };

    const state = fromJS({
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
        agencies: [{ id: 1, unique_id: "agency-unicef", name: "UNICEF" }],
        webpush: {
          enabled: false
        }
      }
    });

    it("renders 20 fields", () => {
      mountedComponent(<Account {...props} />, state, {}, ["/account"]);
      expect(screen.getAllByTestId("form-section-field")).toHaveLength(20);
    });
  });
});
