import { mountedComponent, screen } from "../../../../../test-utils";

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

  it("should render FastField", () => {
    mountedComponent(<AttachmentInput {...props} />, {}, [], {}, formProps);
    expect(screen.getByTestId("input-file")).toBeInTheDocument();
  });

  it("should render ActionButton", () => {
    mountedComponent(<AttachmentInput {...props} />, {}, [], {}, formProps);
    expect(screen.getByText("fields.file_upload_box.select_file_button_text")).toBeInTheDocument();
  });
});
