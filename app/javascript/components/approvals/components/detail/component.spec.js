import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { CASE_PLAN, STATUS_APPROVED } from "../../constants";

import ApprovalDetail from "./component";

describe("<ApprovalDetail /> - Component", () => {
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01",
      approval_status: STATUS_APPROVED,
      approval_response_for: CASE_PLAN
    }),
    css: {},
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
    mountedComponent(<ApprovalDetail {...props} />, initialState);
  });

  it("render ApprovalDetail component", () => {
    const element = screen.getByText("approvals.response_for_label");

    expect(element).toBeInTheDocument();
  });

  it("render a DisplayData", () => {
    expect(screen.getAllByTestId("container")).toHaveLength(1);
  });

  it("render the correct approvals label", () => {
    expect(screen.getAllByText(CASE_PLAN)).toBeTruthy();
  });
});
