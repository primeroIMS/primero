import { mountedComponent, screen } from "../../../../../test-utils";

import { ATTACHMENT_TYPES } from "./constants";
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

  it("should render ActionDialog", () => {
    mountedComponent(<AttachmentField {...props} />, {}, [], {}, formProps);
    expect(screen.getByText("fields.file_upload_box.select_file_button_text")).toBeInTheDocument();
  });

  it("should render ActionButton", () => {
    mountedComponent(<AttachmentField {...props} />, {}, [], {}, formProps);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  describe("when value contains attachmentUrl", () => {
    it("should not render the AttachmentInput", () => {
      mountedComponent(<AttachmentField {...props} />, {}, [], {}, formProps);
      expect(screen.queryByRole("textbox")).toBeNull();
    });

    it("should render the AttachmentPreview", () => {
      mountedComponent(<AttachmentField {...props} />, {}, [], {}, formProps);
      expect(screen.getByText("fields.file_upload_box.select_file_button_text")).toBeInTheDocument();
    });
  });

  describe("when value doesn't contains attachmentUrl", () => {
    it("should render the AttachmentInput", () => {
      mountedComponent(<AttachmentField {...props} />, {}, [], {}, formProps);
      expect(screen.getByTestId("input-file")).toBeInTheDocument();
    });

    it("should not render the AttachmentPreview", () => {
      mountedComponent(<AttachmentField {...props} />, {}, [], {}, formProps);
      expect(screen.queryByTestId("attachment")).toBeNull();
    });
  });
});
