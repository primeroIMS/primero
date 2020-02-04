import { expect } from "chai";
import { fromJS } from "immutable";
import {
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import TransferApproval from "./component";

describe("<TransferApproval /> - Component", () => {
  let component;
  const props = {
    openTransferDialog: false,
    close: () => {},
    approvalType: "accepted",
    recordId: "10",
    transferId: "20"
  };
  const initialState = fromJS({
    cases: {
      data: [
        {
          record_state: true,
          assigned_user_names: ["primero_cp"],
          sex: "male",
          transfer_status: "in_progress",
          owned_by_agency_id: 1,
          notes_section: [],
          date_of_birth: "1981-02-04",
          record_in_scope: true,
          case_id: "5f0c7bd6-7d84-4367-91f1-d29ad7b970f8",
          created_at: "2020-02-04T20:22:40.716Z",
          name_last: "asfd",
          name: "asdf asfd",
          alert_count: 0,
          previously_owned_by: "primero",
          case_id_display: "7b970f8",
          created_by: "primero",
          module_id: "primeromodule-cp",
          owned_by: "primero",
          reopened_logs: [],
          status: "open",
          registration_date: "2020-02-04",
          complete: true,
          type: "cases",
          id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
          flag_count: 0,
          name_first: "asdf",
          short_id: "7b970f8",
          age: 39,
          workflow: "new"
        }
      ],
      errors: false
    },
    transitions: {
      data: [
        {
          id: "be62e823-4d9d-402e-aace-8e4865a4882e",
          record_id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
          record_type: "case",
          created_at: "2020-02-04T20:24:49.464Z",
          notes: "",
          rejected_reason: "",
          status: "in_progress",
          type: "Transfer",
          consent_overridden: true,
          consent_individual_transfer: true,
          transitioned_by: "primero",
          transitioned_to: "primero_cp",
          service: null
        }
      ]
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(TransferApproval, props, initialState));
  });

  it("renders Transitions component", () => {
    expect(component.find(TransferApproval)).to.have.length(1);
  });
});