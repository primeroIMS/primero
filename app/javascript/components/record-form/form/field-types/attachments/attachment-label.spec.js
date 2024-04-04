// Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import AttachmentLabel from "./attachment-label";

describe("<AttachmentLabel />", () => {
  const props = {
    label: "Some label",
    helpText: "Some Help Text",
    mode: { isShow: false },
    handleAttachmentAddition: () => {},
    arrayHelpers: {},
    disabled: false
  };

  beforeEach(() => {
    mountedComponent(<AttachmentLabel {...props} />);
  });

  it("renders the AttachmentLabel", () => {
    expect(screen.getAllByTestId("attachment-label")).toHaveLength(1);
  });

  it("renders the FormHelperText", () => {
    expect(screen.getAllByTestId("attachment-label-helptext")).toHaveLength(1);
  });

  it("renders a <ActionButton /> component", () => {
    expect(screen.getAllByTestId("attachment-label-action-button")).toHaveLength(1);
  });
});
