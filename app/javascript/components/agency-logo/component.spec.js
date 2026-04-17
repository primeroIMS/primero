import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

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

    mountedComponent(<AgencyLogo />, state);
    expect(screen.getByTestId("background")).toBeInTheDocument('background-image: url("logo-full.png")');
  });
});
