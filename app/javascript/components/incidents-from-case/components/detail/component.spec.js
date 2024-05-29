import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../config";

import IncidentDetail from "./component";

describe("<IncidentDetail /> - Component", () => {
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
    mountedComponent(<IncidentDetail {...props} />, initialState);
  });

  it("render IncidentDetail component", () => {
    expect(screen.getByText("incidents.date_of_incident")).toBeInTheDocument();
  });

  it("render a DisplayData", () => {
    expect(screen.getAllByTestId("display-data")).toBeTruthy();
  });

  it("render a DisplayData with action button", () => {
    expect(screen.getAllByRole("button")).toBeTruthy();
  });
});
