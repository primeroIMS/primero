import { mountedComponent, screen } from "../../../../../test-utils";

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
    const audioProps = { ...props, attachment: ATTACHMENT_TYPES.audio };

    mountedComponent(<AttachmentPreview {...audioProps} />);
    expect(screen.getByTestId("audio")).toBeInTheDocument();
  });

  it("should render an img", () => {
    mountedComponent(<AttachmentPreview {...props} />, {}, [], {}, formProps);
    expect(screen.getByRole("presentation")).toBeInTheDocument();
    expect(screen.getByTestId("attachment")).toBeInTheDocument();
  });
});
