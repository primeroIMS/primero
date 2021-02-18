import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import IncidentSummary from "./component";

describe("<IncidentSummary /> - Component", () => {
  let component;
  const props = {
    incidentDate: "2020-Oct-01",
    css: {
      titleHeader: {}
    },
    incidentType: <></>
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(IncidentSummary, props, fromJS({})));
  });

  it("render IncidentSummary component", () => {
    expect(component.find(IncidentSummary)).to.have.length(1);
  });

  it("render a Grid", () => {
    expect(component.find(Grid)).to.have.lengthOf(2);
  });

  it("renders component with valid props", () => {
    const incidentSummaryProps = { ...component.find(IncidentSummary).props() };

    ["css", "incidentDate", "incidentType"].forEach(property => {
      expect(incidentSummaryProps).to.have.property(property);
      delete incidentSummaryProps[property];
    });
    expect(incidentSummaryProps).to.be.empty;
  });
});
