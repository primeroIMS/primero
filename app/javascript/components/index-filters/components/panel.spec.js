// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { fireEvent, mountedFormComponent, screen } from "../../../test-utils";

import Panel from "./panel";

describe("<IndexFilters />/<Panel />", () => {
  let props;

  beforeEach(() => {
    props = {
      filter: {
        field_name: "filter1",
        name: "filter1",
        options: [{ id: "true", display_name: "Filter 1" }],
        type: "checkbox"
      },
      getValues: jest.fn().mockReturnValue({ filter1: "option-1" }),
      handleReset: jest.fn(),
      children: "Child Component"
    };
  });

  it("renders children", () => {
    mountedFormComponent(<Panel {...props} />, { includeFormProvider: true });
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("opens if field has value", () => {
    mountedFormComponent(<Panel {...props} />, { includeFormProvider: true });
    expect(screen.getAllByRole("button", { expanded: true }).at(0)).toBeInTheDocument();
  });

  it("closes if field has value on click", () => {
    mountedFormComponent(<Panel {...props} />, { includeFormProvider: true });
    fireEvent.click(screen.getAllByRole("button", { expanded: true }).at(0));

    expect(screen.getAllByRole("button", { expanded: false }).at(0)).toBeInTheDocument();
  });

  it("resets field value", () => {
    mountedFormComponent(<Panel {...props} />, { includeFormProvider: true });

    fireEvent.click(document.querySelector("button[aria-label='buttons.delete']"));

    expect(props.handleReset).toHaveBeenCalledTimes(1);
  });

  it("render the correct label if the filter is for approval", () => {
    const propsApprovals = {
      filter: {
        name: "approvals.case_plan",
        field_name: "approval_status_case_plan",
        options: {
          en: [
            { id: "pending", display_name: "Pending" },
            { id: "approved", display_name: "Approved" },
            { id: "rejected", display_name: "Rejected" }
          ]
        },
        type: "multi_toggle"
      },
      getValues: jest.fn().mockReturnValue({ filter1: "option-1" }),
      handleReset: jest.fn(),
      children: "Child Component"
    };
    const initialStateApprovals = fromJS({
      application: {
        approvalsLabels: {
          case_plan: {
            en: "Case Plan"
          }
        }
      }
    });

    mountedFormComponent(<Panel {...propsApprovals} />, {
      state: initialStateApprovals,
      includeFormProvider: true
    });

    expect(screen.getByText("Case Plan")).toBeInTheDocument();
  });
});
