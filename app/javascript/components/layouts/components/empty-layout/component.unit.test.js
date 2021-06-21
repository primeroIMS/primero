import { fromJS } from "immutable";

import { routes } from "../../../../config";
import { setupMountedComponent } from "../../../../test";
import DemoIndicator from "../../../demo-indicator";
import SessionTimeoutDialog from "../../../session-timeout-dialog";

import EmptyLayout from "./component";

describe("layouts/components/<EmptyLayout />", () => {
  let component;

  beforeEach(() => {
    const state = fromJS({
      ui: {
        Nav: {
          drawerOpen: true
        }
      },
      user: {
        modules: "primero",
        agency: "unicef",
        isAuthenticated: true,
        messages: null,
        permissions: {
          incidents: ["manage"],
          tracing_requests: ["manage"],
          cases: ["manage"]
        }
      },
      application: {
        baseLanguage: "en",
        modules: [
          {
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case"]
          }
        ]
      },
      records: {
        support: {
          data: {
            demo: true
          }
        }
      }
    });

    component = setupMountedComponent(EmptyLayout, { route: routes[0] }, state, ["/cases"]).component;
  });

  it("renders DemoIndicator component", () => {
    expect(component.find(DemoIndicator)).to.have.lengthOf(1);
  });

  it("renders SessionTimeoutDialog component", () => {
    expect(component.find(SessionTimeoutDialog)).to.have.lengthOf(1);
  });
});
