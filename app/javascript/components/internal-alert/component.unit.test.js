import { fromJS } from "immutable";
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";

import { setupMountedComponent } from "../../test";

import InternalAlert from "./component";

describe("<InternalAlert />", () => {
  it("renders the InternalAlert", () => {
    const { component } = setupMountedComponent(
      InternalAlert,
      { items: fromJS([{ message: "Alert Message 1" }]), severity: "warning" },
      {}
    );

    expect(component.find(InternalAlert)).to.have.lengthOf(1);
    expect(component.find(ExpansionPanelSummary).text()).to.be.equal(
      "Alert Message 1"
    );
  });

  it("does not render details if there is only one alert", () => {
    const { component } = setupMountedComponent(
      InternalAlert,
      { items: fromJS([{ message: "Alert Message 1" }]), severity: "warning" },
      {}
    );

    expect(component.find(ExpansionPanelDetails)).to.have.lengthOf(0);
  });

  it("renders details if there are several alert", () => {
    const { component } = setupMountedComponent(
      InternalAlert,
      {
        items: fromJS([
          { message: "Alert Message 1" },
          { message: "Alert Message 2" }
        ]),
        severity: "warning"
      },
      {}
    );

    expect(component.find(ExpansionPanelDetails)).to.have.lengthOf(1);
    expect(
      component
        .find(ExpansionPanelDetails)
        .find("li")
        .map(f => f.text())
    ).to.deep.equal(["Alert Message 1", "Alert Message 2"]);
  });
});
