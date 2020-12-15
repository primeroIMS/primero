import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";

import AgencyLogo from "./component";

describe("<AgencyLogo />", () => {
  it("renders agency logo from state", () => {
    const state = fromJS({
      application: {
        primero: {
          sandbox_ui: false,
          agencies: [
            {
              unique_id: "1",
              name: "Test logo",
              logo_icon: "logo-icon.png",
              logo_full: "logo-full.png"
            }
          ]
        }
      }
    });
    const { component } = setupMountedComponent(AgencyLogo, {}, state);

    expect(component.find("div").at(1).prop("style")).to.have.property("backgroundImage", "url(logo-full.png)");
  });
});
