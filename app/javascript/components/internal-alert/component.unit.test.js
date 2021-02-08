import { fromJS } from "immutable";
import { AccordionDetails, AccordionSummary } from "@material-ui/core";

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
    expect(component.find(AccordionSummary).text()).to.be.equal("Alert Message 1");
  });

  it("does not render details if there is only one alert", () => {
    const { component } = setupMountedComponent(
      InternalAlert,
      { items: fromJS([{ message: "Alert Message 1" }]), severity: "warning" },
      {}
    );

    expect(component.find(AccordionDetails)).to.have.lengthOf(0);
  });

  it("renders details if there are several alert", () => {
    const { component } = setupMountedComponent(
      InternalAlert,
      {
        items: fromJS([{ message: "Alert Message 1" }, { message: "Alert Message 2" }]),
        severity: "warning"
      },
      {}
    );

    expect(component.find(AccordionDetails)).to.have.lengthOf(1);
    expect(
      component
        .find(AccordionDetails)
        .find("li")
        .map(f => f.text())
    ).to.deep.equal(["Alert Message 1", "Alert Message 2"]);
  });

  it("renders the specified title", () => {
    const title = "This is the title";
    const { component } = setupMountedComponent(
      InternalAlert,
      {
        title,
        items: fromJS([{ message: "Alert Message 1" }, { message: "Alert Message 2" }]),
        severity: "warning"
      },
      {}
    );

    expect(component.find(AccordionSummary).text()).to.be.equal(title);
  });
});
