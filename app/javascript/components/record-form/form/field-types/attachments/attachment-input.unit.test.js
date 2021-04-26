import { FastField } from "formik";

import { setupMountedComponent } from "../../../../../test";
import ActionButton from "../../../../action-button";

import { ATTACHMENT_TYPES } from "./constants";
import AttachmentInput from "./attachment-input";

describe("<AttachmentInput />", () => {
  const props = {
    fields: {},
    attachment: ATTACHMENT_TYPES.document,
    name: "attachment_field_test",
    deleteButton: <></>,
    value: "test"
  };

  const formProps = {
    initialValues: {}
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(AttachmentInput, props, {}, [], formProps));
  });

  it("should render FastField", () => {
    expect(component.find(FastField)).to.have.lengthOf(1);
  });

  it("should render ActionButton", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });
});
