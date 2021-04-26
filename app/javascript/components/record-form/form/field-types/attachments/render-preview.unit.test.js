import { createSimpleMount } from "../../../../../test";

import AttachmentPreview from "./attachment-preview";
import { ATTACHMENT_TYPES } from "./constants";
import renderPreview from "./render-preview";

describe("renderPreview", () => {
  const css = {};
  const deleteButton = null;

  it("should return false if there is no data", () => {
    expect(renderPreview(ATTACHMENT_TYPES.photo, {}, css, deleteButton)).to.be.false;
  });

  it("should return a span with the file name if attachment it's document", () => {
    const file = {
      data: {},
      fileName: "test.txt"
    };

    const component = createSimpleMount(renderPreview(ATTACHMENT_TYPES.document, file, css, deleteButton));

    expect(component.find("span")).to.have.lengthOf(1);
    expect(component.text()).to.be.equal("test.txt");
  });

  it("should return an AttachmentPreview", () => {
    const file = {
      data: "abcd",
      fileName: "test.png"
    };

    const component = createSimpleMount(renderPreview(ATTACHMENT_TYPES.photo, file, css, deleteButton));

    expect(component.find(AttachmentPreview)).to.have.lengthOf(1);
  });
});
