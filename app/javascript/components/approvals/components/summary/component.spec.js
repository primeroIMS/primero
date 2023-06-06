import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { CASE_PLAN, STATUS_APPROVED } from "../../constants";

import ApprovalSummary from "./component";

describe("<ApprovalSummary /> - Component", () => {
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01",
      approval_status: STATUS_APPROVED,
      approval_response_for: CASE_PLAN
    }),
    css: {
      approvalsValueSummary: "approvalsValueSummary"
    },
    isRequest: false,
    isResponse: true
  };

  const initialState = fromJS({
    application: {
      approvalsLabels: {
        case_plan: {
          en: CASE_PLAN
        }
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<ApprovalSummary {...props} />, initialState);
  });

  it("render ApprovalSummary component", () => {
    expect(screen.getAllByTestId("sectionheader")).toHaveLength(1);
  });

  it("render a Chip with the correct approvals label", () => {
    expect(screen.getByText("approvals.status.approved")).toBeTruthy();
  });
});
