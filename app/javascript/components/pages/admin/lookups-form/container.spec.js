// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../permissions";

import LookupsForm from "./container";

describe("<LookupsForm /> - container", () => {
  beforeEach(() => {
    const initialState = fromJS({
      records: {
        admin: {
          lookups: {
            selectedLookup: {
              id: 1,
              name: "Test Lookup"
            }
          }
        }
      },
      user: {
        permissions: {
          metadata: [ACTIONS.MANAGE]
        }
      }
    });

    mountedComponent(<LookupsForm mode="edit" />, initialState, ["/admin/lookups/1"]);
  });

  it("renders LookupForm component", () => {
    expect(document.querySelector("#lookups-form")).toBeInTheDocument();
  });

  it("renders heading with two FormAction components", () => {
    expect(screen.getAllByRole("button")).toBeTruthy();
  });
});
