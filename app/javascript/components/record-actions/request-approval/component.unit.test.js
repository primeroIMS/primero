import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import ActionDialog from "../../action-dialog";
import { APPROVAL_TYPE, APPROVAL_DIALOG } from "../constants";
import { RECORD_TYPES, RECORD_PATH, APPROVALS_TYPES } from "../../../config";

import RequestApproval from "./component";

describe("<RequestApproval />", () => {
  let component;
  const initialState = fromJS({
    application: {
      online: true,
      approvalsLabels: {
        assessment: {
          en: "Assessment"
        },
        case_plan: {
          en: "Case plan"
        },
        closure: {
          en: "Closure"
        }
      }
    }
  });
  const props = {
    approvalType: APPROVAL_TYPE,
    close: () => {},
    confirmButtonLabel: "buttons.submit",
    dialogName: APPROVAL_DIALOG,
    openRequestDialog: true,
    pending: false,
    record: {},
    recordType: RECORD_PATH.cases,
    setPending: () => {},
    subMenuItems: [
      {
        name: "assessment",
        condition: true,
        recordType: RECORD_TYPES.all,
        value: APPROVALS_TYPES.assessment
      }
    ]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      RequestApproval,
      props,
      initialState
    ));
  });

  it("renders RequestApproval", () => {
    expect(component.find(RequestApproval)).to.have.lengthOf(1);
  });

  it("renders ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const requestApproval = { ...component.find(RequestApproval).props() };

    [
      "approvalType",
      "close",
      "confirmButtonLabel",
      "dialogName",
      "openRequestDialog",
      "pending",
      "record",
      "recordType",
      "setPending",
      "subMenuItems"
    ].forEach(property => {
      expect(requestApproval).to.have.property(property);
      delete requestApproval[property];
    });
    expect(requestApproval).to.be.empty;
  });
});
