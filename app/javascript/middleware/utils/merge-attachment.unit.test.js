// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import mergeAttachment from "./merge-attachment";

describe("middleware/utils/merge-attachment.js", () => {
  it("merges an attachment when is new", () => {
    const attachments = [{ id: 1, attachment_url: "/path/to/attachment1", file_name: "attachment1" }];
    const json = { data: { id: 2, attachment_url: "/path/to/attachment2", file_name: "attachment2" } };
    const fromAttachment = { _destroy: false };

    expect(mergeAttachment(attachments, json, fromAttachment)).toEqual([...attachments, json.data]);
  });

  it("merges an attachment when is new and was created offline", () => {
    const attachments = [
      { id: 1, attachment_url: "/path/to/attachment1", file_name: "attachment1" },
      { attachment: "base64_attachment", file_name: "attachment2" }
    ];
    const json = { data: { id: 2, attachment_url: "/path/to/attachment2", file_name: "attachment2" } };
    const fromAttachment = { _destroy: false };

    expect(mergeAttachment(attachments, json, fromAttachment)).toEqual([attachments[0], json.data]);
  });

  it("merges an existing attachment", () => {
    const attachments = [
      { id: 1, attachment_url: "/path/to/attachment1", file_name: "attachment1", description: "Description 1" }
    ];
    const json = {
      data: { id: 1, attachment_url: "/path/to/attachment1", file_name: "attachment1", description: "Attachment 1" }
    };
    const fromAttachment = { id: 1, _destroy: false };

    expect(mergeAttachment(attachments, json, fromAttachment)).toEqual([{ ...json.data, marked_destroy: false }]);
  });
});
