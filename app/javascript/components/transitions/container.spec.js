import { Map, List } from "immutable";

import { mountedComponent, screen } from "../../test-utils";

import Transitions from "./container";

describe("<Transitions /> - Component", () => {
  const props = {
    fetchable: true,
    recordType: "cases",
    recordID: "6b0018e7-d421-4d6b-80bf-ca4cbf488907"
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

  it("renders Transitions component", () => {
    mountedComponent(<Transitions {...props} />, initialState);
    expect(screen.getByTestId("transitions")).toBeInTheDocument();
  });

  it("renders 2 TransitionPanel", () => {
    mountedComponent(<Transitions {...props} />, initialState);
    expect(screen.getAllByTestId("accordion")).toHaveLength(3);
  });

  it("renders a Assignments components", () => {
    mountedComponent(<Transitions {...props} />, initialState);
    expect(screen.getByText(/transition.type.assign/i)).toBeInTheDocument();
    expect(screen.getAllByText(/transition.notes/i)).toHaveLength(3);
  });

  it("renders a Transfers components", () => {
    mountedComponent(<Transitions {...props} />, initialState);
    expect(screen.getByText(/transition.no_consent_share/i)).toBeInTheDocument();
    expect(screen.getByText(/transition.type.transferRequest/i)).toBeInTheDocument();
  });

  it("renders TransferRequests components", () => {
    mountedComponent(<Transitions {...props} />, initialState);
    expect(screen.getByText(/transition.type.transferRequest/i)).toBeInTheDocument();
    expect(screen.getAllByText(/transition.recipient/i)).toHaveLength(3);
  });
});