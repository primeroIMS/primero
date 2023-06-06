import { screen, setupMockFormComponent } from "test-utils";

import FormSectionField from "../components/form-section-field";
import { AUDIO_RECORD_FIELD, PHOTO_RECORD_FIELD } from "../constants";

describe("<Form /> - fields/<RecordAttachmentInput />", () => {
  it("when it is a PHOTO_RECORD_FIELD- should render the photo array", () => {
    const name = "photo_field";

    setupMockFormComponent(FormSectionField, {
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

    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("when it is a AUDIO_RECORD_FIELD - renders the audio content", () => {
    const name = "audio_field";

    setupMockFormComponent(FormSectionField, {
      props: {
        field: {
          name,
          display_name: "Audio Field",
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
    expect(screen.getByText("Audio Field")).toBeInTheDocument();
  });
});
