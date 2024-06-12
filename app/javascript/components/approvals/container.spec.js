// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import Approvals from "./container";

describe("<Approvals /> - Component", () => {
  const props = {
    approvals: fromJS([
      {
        unique_id: "6e96ab79-d786-4117-a48c-c99194741beb",
        approved_by: "primero",
        approval_date: "2020-01-01",
        approval_status: "rejected",
        approval_for_type: "Action Plan",
        approval_response_for: "assessment",
        approval_requested_for: null,
        approval_manager_comments: "First comment"
      },
      {
        unique_id: "670332c6-1f1d-415d-9df5-1d94039ce79a",
        approved_by: "primero1",
        approval_date: "2020-01-02",
        approval_status: "approved",
        approval_for_type: "Service Provision",
        approval_response_for: "bia",
        approval_requested_for: null,
        approval_manager_comments: "This is the second comment"
      },
      {
        unique_id: "dab91917-3fbd-4cde-bf42-b09df19dbf08",
        approved_by: "primero2",
        approval_date: "2020-01-03",
        approval_status: "requested",
        approval_for_type: null,
        approval_response_for: null,
        approval_requested_for: "closure",
        approval_manager_comments: "This is third comment"
      },
      {
        unique_id: "e6952ae6-3515-4000-a6c2-b8dcd93cb28a",
        approved_by: "primero3",
        approval_date: "2020-01-04",
        approval_status: "requested",
        approval_for_type: "Case Plan",
        approval_response_for: null,
        approval_requested_for: "case_plan",
        approval_manager_comments: "This is the last comment"
      }
    ]),
    handleToggleNav: () => {},
    mobileDisplay: false
  };

  it("should render text", () => {
    mountedComponent(<Approvals {...props} />);

    expect(screen.getByTestId("approvals")).toBeInTheDocument();
  });

  it("renders 4 ApprovalsPanel", () => {
    mountedComponent(<Approvals {...props} />);

    expect(screen.getAllByTestId("approval-panel")).toHaveLength(4);
    expect(screen.getAllByTestId("approval-detail")).toHaveLength(4);
    expect(screen.getAllByTestId("approval-summary")).toHaveLength(4);
  });

  describe("when we don't have data", () => {
    const emptyProps = { mobileDisplay: true, handleToggleNav: () => {} };

    it("renders Approvals component", () => {
      mountedComponent(<Approvals {...emptyProps} />);

      expect(screen.getByTestId("approvals")).toBeInTheDocument();
    });

    it("does not render ApprovalPanel only the title", () => {
      mountedComponent(<Approvals {...emptyProps} />);

      expect(screen.queryAllByTestId("approval-panel")).toHaveLength(0);
      expect(screen.getByTestId("record-form-title")).toBeInTheDocument();
      expect(screen.getByText("forms.record_types.approvals")).toBeInTheDocument();
    });
  });
});
