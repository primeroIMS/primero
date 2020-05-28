import { fromJS } from "immutable";
import { TextField, RadioGroup, Select } from "@material-ui/core";

import { setupMountedComponent } from "../../../test";

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
    const { component } = setupMountedComponent(ApprovalForm, props, state);

    expect(component.find(RadioGroup)).to.have.lengthOf(1);
  });

  it("renders Select", () => {
    const { component } = setupMountedComponent(ApprovalForm, props, state);

    expect(component.find(Select)).to.have.lengthOf(1);
  });

  it("renders TextField", () => {
    const { component } = setupMountedComponent(ApprovalForm, props, state);

    expect(component.find(TextField)).to.have.lengthOf(1);
  });
});
