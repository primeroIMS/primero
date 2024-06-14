import { mountedComponent, screen, fireEvent } from "../../../../../test-utils";

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

  it("should render component", () => {
    mountedComponent(<AttachmentField {...props} />, {}, [], {}, formProps);
    expect(document.querySelector(".uploadBox")).toBeInTheDocument();
    expect(screen.getByText("fields.file_upload_box.select_file_button_text")).toBeInTheDocument();
  });

  it("should render ActionButton", () => {
    mountedComponent(<AttachmentField {...props} />, {}, [], {}, formProps);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  describe("when value contains attachmentUrl", () => {
    const newProps = {
      ...props,
      value: {
        attachment_url: "random-string"
      }
    };

    it("should render ActionDialog", () => {
      mountedComponent(<AttachmentField {...newProps} />, {}, [], {}, formProps);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByText("fields.remove attachment_field_test")).toBeInTheDocument();
    });

    it("should not render the AttachmentInput", () => {
      mountedComponent(<AttachmentField {...newProps} />, {}, [], {}, formProps);
      expect(screen.queryByRole("textbox")).toBeNull();
    });

    it("should render the AttachmentPreview", () => {
      mountedComponent(<AttachmentField {...newProps} />, {}, [], {}, formProps);
      expect(screen.getByRole("presentation")).toBeInTheDocument();
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
