// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { screen, mountedFieldComponent } from "test-utils";

import { FILE_FORMAT } from "../../../config";

import AttachmentInput from "./attachment-input";

describe("<Form /> - fields/<AttachmentInput />", () => {
  const props = {
    commonInputProps: {
      label: "Test label",
      name: "test"
    },
    metaInputProps: {
      fileFormat: FILE_FORMAT.pdf,
      renderDownloadButton: true
    }
  };

  it("renders input label and form helper text", () => {
    mountedFieldComponent(<AttachmentInput {...props} />);
    expect(screen.getByText("fields.file_upload_box.select_file_button_text")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
