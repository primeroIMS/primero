// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { screen, setupMockFieldComponent } from "test-utils";

import { FieldRecord } from "../records";
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
    setupMockFieldComponent(AttachmentInput, FieldRecord, {}, props);
    expect(screen.getByText("fields.file_upload_box.select_file_button_text")).toBeInTheDocument();
    expect(document.querySelector("#test")).toBeInTheDocument();
  });
});
