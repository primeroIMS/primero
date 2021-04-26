import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import DisplayData from "../../../display-data";
import ActionButton from "../../../action-button";
import { RECORD_TYPES } from "../../../../config";

import IncidentDetail from "./component";

describe("<IncidentDetail /> - Component", () => {
  let component;
  const props = {
    css: {
      titleHeader: {}
    },
    handleSubmit: () => {},
    incidentCaseId: "case-unique-id-1",
    incidentCaseIdDisplay: "case-short-id-1",
    incidentDateInterview: "2020-Oct-02",
    incidentDate: "2020-Oct-01",
    incidentUniqueID: "e25c5cb1-1257-472e-b2ec-05f568a3b51e",
    incidentType: "test",
    mode: { isShow: true, isEdit: false },
    setFieldValue: () => {},
    recordType: RECORD_TYPES.cases,
    handleCreateIncident: () => {}
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

    [
      "css",
      "handleSubmit",
      "incidentCaseId",
      "incidentCaseIdDisplay",
      "incidentDateInterview",
      "incidentDate",
      "incidentUniqueID",
      "incidentType",
      "mode",
      "setFieldValue",
      "recordType",
      "handleCreateIncident"
    ].forEach(property => {
      expect(incidentDetailProps).to.have.property(property);
      delete incidentDetailProps[property];
    });
    expect(incidentDetailProps).to.be.empty;
  });
});
