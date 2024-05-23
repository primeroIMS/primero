// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";
import { APPROVAL_TYPE, APPROVAL_DIALOG } from "../constants";
import { RECORD_TYPES, RECORD_PATH, APPROVALS_TYPES } from "../../../config";

import RequestApproval from "./component";

describe("<RequestApproval />", () => {
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
    open: true,
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

  it("renders RequestApproval", () => {
    mountedComponent(<RequestApproval {...props} />, initialState);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
