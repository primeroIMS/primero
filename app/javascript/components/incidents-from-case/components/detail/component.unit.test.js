import React from "react";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import DisplayData from "../../../display-data";
import ActionButton from "../../../action-button";

import IncidentDetail from "./component";

describe("<IncidentDetail /> - Component", () => {
  let component;
  const props = {
    incidentDate: "2020-Oct-01",
    incidentDateInterview: "2020-Oct-02",
    css: {
      titleHeader: {}
    },
    incidentUniqueID: "e25c5cb1-1257-472e-b2ec-05f568a3b51e",
    incidentType: <></>
  };

  const initialState = fromJS({
    user: {
      permissions: {
        incidents: ["read", "write"]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(IncidentDetail, props, initialState));
  });

  it("render IncidentDetail component", () => {
    expect(component.find(IncidentDetail)).to.have.length(1);
  });

  it("render a Grid", () => {
    expect(component.find(Grid)).to.have.lengthOf(6);
  });

  it("render a DisplayData", () => {
    expect(component.find(DisplayData)).to.have.lengthOf(3);
  });

  it("render a DisplayData", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(2);
  });

  it("renders component with valid props", () => {
    const incidentDetailProps = { ...component.find(IncidentDetail).props() };

    ["css", "incidentDateInterview", "incidentDate", "incidentUniqueID", "incidentType"].forEach(property => {
      expect(incidentDetailProps).to.have.property(property);
      delete incidentDetailProps[property];
    });
    expect(incidentDetailProps).to.be.empty;
  });
});
