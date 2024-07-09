// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { MANAGE } from "../../permissions";
import { mountedComponent, screen } from "../../../test-utils";

import Admin from "./container";

describe("<Admin />", () => {
  const initialState = fromJS({});

  beforeEach(() => {
    mountedComponent(<Admin routes={[]} />, initialState);
  });

  it("renders the admin title", () => {
    expect(screen.getByText("settings.title")).toBeInTheDocument();
  });

  describe("when user doesn't have access to metadata", () => {
    const initialStateNoMetadata = fromJS({
      user: {
        isAuthenticated: true,
        id: 4,
        username: "primero_mgr_cp",
        modules: ["primeromodule-cp"],
        permissions: {
          users: MANAGE,
          agencies: MANAGE,
          roles: MANAGE
        }
      }
    });

    beforeEach(() => {
      mountedComponent(<Admin routes={[]} />, initialStateNoMetadata);
    });

    it("renders only the permitted items", () => {
      expect(screen.getAllByRole("navigation").at(1)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(3);
    });
  });
});
