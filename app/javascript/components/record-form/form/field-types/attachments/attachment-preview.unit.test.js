import { setupMountedComponent } from "../../../../../test";

import { ATTACHMENT_TYPES } from "./constants";
import AttachmentPreview from "./attachment-preview";

describe("<AttachmentPreview />", () => {
  const props = {
    name: "attachment_field_test",
    attachment: ATTACHMENT_TYPES.photo,
    attachmentUrl: "abcd"
  };

  const formProps = {
    initialValues: {}
  };

  it("should render an audio", () => {
    const { component } = setupMountedComponent(AttachmentPreview, { ...props, attachment: ATTACHMENT_TYPES.audio });

    expect(component.find("audio")).to.have.lengthOf(1);
  });

  it("should render an img", () => {
    const { component } = setupMountedComponent(AttachmentPreview, props, {}, [], formProps);

    expect(component.find("img")).to.have.lengthOf(1);
  });
});
