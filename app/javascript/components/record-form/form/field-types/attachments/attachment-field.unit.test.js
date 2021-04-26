import { setupMountedComponent } from "../../../../../test";
import ActionDialog from "../../../../action-dialog";
import ActionButton from "../../../../action-button";

import { ATTACHMENT_TYPES } from "./constants";
import AttachmentInput from "./attachment-input";
import AttachmentPreview from "./attachment-preview";
import AttachmentField from "./attachment-field";

describe("<AttachmentField />", () => {
  const props = {
    arrayHelpers: {},
    attachment: ATTACHMENT_TYPES.document,
    disabled: false,
    mode: {
      isShow: false,
      isEdit: true
    },
    name: "attachment_field_test",
    index: 0,
    value: {}
  };

  const formProps = {
    initialValues: {}
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(AttachmentField, props, {}, [], formProps));
  });

  it("should render ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("should render ActionButton", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });

  describe("when value contains attachmentUrl", () => {
    const { component: componentWithAttachment } = setupMountedComponent(
      AttachmentField,
      { ...props, value: { attachment_url: "test" } },
      {},
      [],
      formProps
    );

    it("should not render the AttachmentInput", () => {
      expect(componentWithAttachment.find(AttachmentInput)).to.not.have.lengthOf(1);
    });

    it("should render the AttachmentPreview", () => {
      expect(componentWithAttachment.find(AttachmentPreview)).to.have.lengthOf(1);
    });
  });

  describe("when value doesn't contains attachmentUrl", () => {
    it("should render the AttachmentInput", () => {
      expect(component.find(AttachmentInput)).to.have.lengthOf(1);
    });

    it("should not render the AttachmentPreview", () => {
      expect(component.find(AttachmentPreview)).to.not.have.lengthOf(1);
    });
  });
});
