// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { CASE_PLAN, STATUS_APPROVED } from "../../constants";

import ApprovalPanel from "./component";

describe("<ApprovalPanel /> - Component", () => {
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01",
      approval_status: STATUS_APPROVED,
      approval_response_for: CASE_PLAN
    }),
    css: {}
  };

  beforeEach(() => {
    mountedComponent(<ApprovalPanel {...props} />);
  });

  it("render ApprovalPanel component", () => {
    const element = screen.getByText("approvals.status.approved");

    expect(element).toBeInTheDocument();
  });

  it("render a Accordion-Details", () => {
    const element = screen.getByText("approvals.response_for_label");

    expect(element).toBeInTheDocument();
  });

  it("render a ApprovalSummary", () => {
    expect(screen.getAllByTestId("approval-summary")).toHaveLength(1);
  });
});
