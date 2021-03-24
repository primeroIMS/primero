import { InputLabel, FormHelperText } from "@material-ui/core";

import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";
import { FILE_FORMAT } from "../../../config";
import ActionButton from "../../action-button";

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
    const { component } = setupMockFieldComponent(AttachmentInput, FieldRecord, {}, props);

    expect(component.find(InputLabel)).to.have.lengthOf(1);
    expect(component.find(FormHelperText)).to.have.lengthOf(1);
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });
});
