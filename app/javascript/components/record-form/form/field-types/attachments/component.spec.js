// Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import AttachmentField from "./component";
import { FIELD_ATTACHMENT_TYPES } from "./constants";

describe("<AttachmentField />", () => {
  const props = {
    label: "Some label",
    helpText: "Some Help Text",
    mode: { isShow: true },
    disabled: false,
    recordType: "cases",
    name: "photos",
    field: {
      type: FIELD_ATTACHMENT_TYPES.photos
    }
  };

  const initialState = {
    records: {
      cases: {
        loading: false,
        recordAttachments: {
          photos: {
            processing: false
          }
        }
      }
    }
  };

  beforeEach(() => {
    mountedComponent(<AttachmentField {...props} />, initialState, {}, [], {
      values: { photos: [{ attachment_url: "random-string" }] }
    });
  });

  it("render the <AttachmentField />", () => {
    expect(screen.getAllByTestId("attachment-label")).toHaveLength(1);
    expect(screen.getAllByTestId("field-array")).toHaveLength(1);
  });

  it("render a AttachmentLabel", () => {
    expect(screen.getAllByTestId("attachment-label-helptext")).toHaveLength(1);
  });
});
