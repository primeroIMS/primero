import { Map, List } from "immutable";
import {
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";

import { setupMountedComponent } from "../../test";

import Transitions from "./container";
import TransitionPanel from "./TransitionPanel";
import AssignmentsSummary from "./assignments/AssignmentsSummary";
import AssignmentsDetails from "./assignments/AssignmentsDetails";
import TransferSummary from "./transfers/TransferDetails";
import TransferDetails from "./transfers/TransferSummary";
import TransferRequestSummary from "./transfer_requests/summary";
import TransferRequestDetails from "./transfer_requests/details";

describe("<Transitions /> - Component", () => {
  let component;
  const props = {
    recordType: "cases",
    record: "6b0018e7-d421-4d6b-80bf-ca4cbf488907"
  };
  const initialState = Map({
    records: Map({
      transitions: Map({
        data: List([
          {
            id: "5a1004bf-fd99-4ada-851f-8acf8bfe1add",
            record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
            record_type: "case",
            created_at: "2019-10-20T16:30:33.452Z",
            notes: "this is the first case transfer",
            rejected_reason: "",
            status: "inprogress",
            type: "Transfer",
            consent_overridden: true,
            consent_individual_transfer: false,
            transitioned_by: "primero",
            transitioned_to: "primero_cp"
          },
          {
            id: "ee1ddfad-cc11-42df-9f39-14c7e6a3c1bb",
            record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
            record_type: "case",
            created_at: "2019-10-18T16:06:36.875Z",
            notes: "this is the first case assigned",
            rejected_reason: "",
            status: "done",
            type: "Assign",
            consent_overridden: false,
            consent_individual_transfer: false,
            transitioned_by: "primero",
            transitioned_to: "primero_cp"
          },
          {
            id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
            record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
            record_type: "case",
            created_at: "2019-10-21T16:13:33.890Z",
            notes: "This is a note",
            status: "done",
            type: "TransferRequest",
            consent_overridden: false,
            consent_individual_transfer: true,
            transitioned_by: "primero",
            transitioned_to: "primero_cp"
          }
        ])
      })
    })
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Transitions, props, initialState));
  });

  it("renders Transitions component", () => {
    expect(component.find(Transitions)).to.have.length(1);
  });

  it("renders 2 TransitionPanel", () => {
    expect(component.find(TransitionPanel)).to.have.lengthOf(3);
    expect(component.find(ExpansionPanelDetails)).to.have.lengthOf(3);
    expect(component.find(ExpansionPanelSummary)).to.have.lengthOf(3);
  });
  it("renders a Assignments components", () => {
    expect(component.find(AssignmentsSummary)).to.have.length(1);
    expect(component.find(AssignmentsDetails)).to.have.length(1);
  });
  it("renders a Transfers components", () => {
    expect(component.find(TransferSummary)).to.have.length(1);
    expect(component.find(TransferDetails)).to.have.length(1);
  });
  it("renders TransferRequests components", () => {
    expect(component.find(TransferRequestSummary)).to.have.lengthOf(1);
    expect(component.find(TransferRequestDetails)).to.have.lengthOf(1);
  });
});
