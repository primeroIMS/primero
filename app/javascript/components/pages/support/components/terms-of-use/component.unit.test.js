import { fromJS } from "immutable";
import { Typography } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";
import ActionButton from "../../../../action-button";

import TermOfUse from "./component";

describe("<TermOfUse />", () => {
  const state = fromJS({
    application: {
      agencies: [
        {
          agency_code: "Other",
          name: {
            en: "Other"
          },
          terms_of_use_enabled: true,
          terms_of_use: "/test/path/file.pdf"
        },
        {
          agency_code: "test",
          name: {
            en: "test"
          },
          terms_of_use_enabled: false
        },
        {
          agency_code: "new",
          name: {
            en: "new"
          },
          pdf_logo_option: false,
          terms_of_use_enabled: true,
          terms_of_use: "/test/path/file2.pdf"
        }
      ]
    }
  });

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(TermOfUse, {}, state));
  });

  it("should render h2", () => {
    const h2Tag = component.find("h2");

    expect(h2Tag).to.have.lengthOf(1);
    expect(h2Tag.text()).to.be.equal("navigation.support_menu.terms_of_use");
  });

  it("should render 2 buttons", () => {
    expect(component.find(Typography)).to.have.lengthOf(2);
    expect(component.find(ActionButton)).to.have.lengthOf(2);
  });
});
