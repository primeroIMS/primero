// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { queueIndexedDB } from "../../db";
import { METHODS, RECORD_PATH } from "../../config";
import uuid from "../../libs/uuid";

import processAttachments from "./process-attachments";

describe("middleware/utils/process-attachments.js", () => {
  let queue;

  beforeEach(() => {
    queue = jest.spyOn(queueIndexedDB, "add").mockResolvedValue();
    jest.spyOn(uuid, "v4").mockReturnValue("1234");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should generate the attachment actions", () => {
    const attachments = { field_1: [{ attachment: "attachment-data" }], field_2: [{ id: 1, _destroy: true }] };

    processAttachments({ attachments, id: 10, recordType: RECORD_PATH.cases });

    expect(queue).toHaveBeenCalledWith([
      {
        type: `${RECORD_PATH.cases}/SAVE_ATTACHMENT`,
        api: {
          path: `${RECORD_PATH.cases}/10/attachments`,
          method: METHODS.POST,
          body: { data: { attachment: "attachment-data" } },
          db: { collection: "records", id: 10, recordType: "cases" }
        },
        fromQueue: "1234",
        tries: 0,
        fromAttachment: { field_name: "field_1", record_type: RECORD_PATH.cases, record: { id: 10 } }
      },
      {
        type: `${RECORD_PATH.cases}/DELETE_ATTACHMENT`,
        api: {
          path: `${RECORD_PATH.cases}/10/attachments/1`,
          method: METHODS.DELETE,
          db: { collection: "records", id: 10, recordType: "cases" }
        },
        fromQueue: "1234",
        tries: 0,
        fromAttachment: {
          id: 1,
          field_name: "field_2",
          record_type: RECORD_PATH.cases,
          record: { id: 10 },
          _destroy: true
        }
      }
    ]);
  });
});
