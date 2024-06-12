// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";

import ApprovalForm from "./approval-form";

describe("<ApprovalForm /> - components/record-actions/request-approval", () => {
  const state = fromJS({});
  const props = {
    approval: "test_approval",
    close: () => {},
    handleChangeApproval: () => {},
    handleChangeComment: () => {},
    handleChangeType: () => {},
    requestType: "",
    selectOptions: fromJS([])
  };

  it("renders RadioGroup", () => {
    mountedComponent(<ApprovalForm {...props} />, state);

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders Select", () => {
    mountedComponent(<ApprovalForm {...props} />, state);

    expect(document.querySelector("input.MuiSelect-nativeInput")).toBeInTheDocument();
  });

  it("renders TextField", () => {
    mountedComponent(<ApprovalForm {...props} />, state);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
