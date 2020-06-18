import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import { FormAction } from "../../../form";

import { LookupForm } from "./components";
import LookupsForm from "./container";

describe("<LookupsForm /> - container", () => {
  let component;

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
          lookups: [ACTIONS.MANAGE]
        }
      }
    });

    ({ component } = setupMountedComponent(
      LookupsForm,
      { mode: "edit" },
      initialState,
      ["/admin/lookups/1"]
    ));
  });

  it("renders LookupForm component", () => {
    expect(component.find(LookupForm)).to.have.lengthOf(1);
  });

  it("renders heading with two FormAction components", () => {
    expect(component.find(FormAction)).to.have.lengthOf(2);
  });
});
