import { fromJS, List } from "immutable";
import { Select } from "@material-ui/core";

import { setupMountedComponent } from "../../../test";
import { RECORD_TYPES } from "../../../config/constants";

import RequestApproval from "./component";

describe("<RequestApproval /> - components/record-actions/request-approval", () => {
  const state = fromJS({
    records: {
      cases: {
        recordAlerts: []
      }
    },
    user: {
      username: "testUser",
      modules: ["primeromodule-cp"]
    },
    options: {
      lookups: {
        data: [
          {
            id: 1,
            unique_id: "lookup-approval-type",
            values: [
              { id: "country", display_text: "Country" },
              { id: "region", display_text: "Region" }
            ]
          }
        ]
      }
    },
    application: {
      modules: List([
        {
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: [
            RECORD_TYPES.cases,
            RECORD_TYPES.tracing_requests,
            RECORD_TYPES.incidents
          ],
          options: {
            selectable_approval_types: true
          }
        }
      ])
    }
  });

  const props = {
    approvalType: "approval",
    close: () => {},
    confirmButtonLabel: "",
    dialogName: "Request Approval",
    openRequestDialog: () => {},
    pending: false,
    record: fromJS({}),
    recordType: "cases",
    setPending: () => {},
    subMenuItems: [
      { name: "SER", condition: true, recordType: "all", value: "bia" },
      {
        name: "Case Plan",
        condition: true,
        recordType: "all",
        value: "case_plan"
      },
      { name: "Closure", condition: true, recordType: "all", value: "closure" }
    ]
  };

  it("renders request approval for Select input", () => {
    const { component } = setupMountedComponent(RequestApproval, props, state);

    expect(component.find(Select)).to.have.lengthOf(1);
  });

  it("renders 3 MenuItem", () => {
    const { component } = setupMountedComponent(RequestApproval, props, state);

    expect(component.find(Select).props().children).to.have.lengthOf(3);
  });
});
