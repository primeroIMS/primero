import FormSectionField from "../components/form-section-field";
import { setupMockFormComponent } from "../../../test";
import { AUDIO_RECORD_FIELD, PHOTO_RECORD_FIELD } from "../constants";
import PhotoArray from "../../record-form/form/field-types/attachments/photo-array";

import AudioArray from "./audio-array";

describe("<Form /> - fields/<RecordAttachmentInput />", () => {
  context("when it is a PHOTO_RECORD_FIELD", () => {
    const name = "photo_field";
    const { component } = setupMockFormComponent(FormSectionField, {
      props: {
        field: {
          name,
          display_name: "Photo Field",
          disabled: false,
          type: PHOTO_RECORD_FIELD
        }
      },
      defaultValues: {
        [name]: [
          { id: "001", attachment_url: "/attachment/1" },
          { id: "002", attachment_url: "/attachment/2" }
        ]
      },
      includeFormMethods: true
    });

    it("should render the photo array", () => {
      expect(component.find(PhotoArray)).to.have.lengthOf(1);
      expect(component.find("img")).to.have.lengthOf(3);
    });
  });

  context("when it is a AUDIO_RECORD_FIELD", () => {
    const name = "audio_field";
    const { component } = setupMockFormComponent(FormSectionField, {
      props: {
        field: {
          name,
          display_name: "Photo Field",
          disabled: false,
          type: AUDIO_RECORD_FIELD
        }
      },
      defaultValues: {
        [name]: [
          { id: "001", attachment_url: "/attachment/1" },
          { id: "002", attachment_url: "/attachment/2" }
        ]
      },
      includeFormMethods: true
    });

    it("renders the audio array", () => {
      expect(component.find(AudioArray)).to.have.lengthOf(1);
      expect(component.find("audio")).to.have.lengthOf(2);
    });
  });
});
