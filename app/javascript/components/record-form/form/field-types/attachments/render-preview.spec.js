import { mountedComponent, screen, simpleMountedComponent } from "../../../../../test-utils";

import { ATTACHMENT_TYPES } from "./constants";
import renderPreview from "./render-preview";

describe("renderPreview", () => {
  const css = {};
  const deleteButton = null;

  it("should return false if there is no data", () => {
    expect(renderPreview(ATTACHMENT_TYPES.photo, {}, css, deleteButton)).toBeFalsy();
  });

  it("should return a span with the file name if attachment it's document", () => {
    const file = {
      data: {},
      fileName: "test.txt"
    };

    simpleMountedComponent(renderPreview(ATTACHMENT_TYPES.document, file, css, deleteButton));
    expect(screen.getByText(/test.txt/i)).toBeInTheDocument();
  });

  it("should return an AttachmentPreview", () => {
    const file = {
      data: "abcd",
      fileName: "test.png"
    };

    mountedComponent(renderPreview(ATTACHMENT_TYPES.photo, file, css, deleteButton));
    expect(screen.getByTestId("attachment")).toBeInTheDocument();
  });
});
