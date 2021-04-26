import uuid from "uuid";

import { queueIndexedDB } from "../../db";
import { stub } from "../../test";
import { METHODS, RECORD_PATH } from "../../config";

import processAttachments from "./process-attachments";

describe("middleware/utils/process-attachments.js", () => {
  let queue;

  beforeEach(() => {
    queue = stub(queueIndexedDB, "add").resolves();
    stub(uuid, "v4").returns("1234");
  });

  afterEach(() => {
    queueIndexedDB.add?.restore();
    uuid.v4?.restore();
  });

  it("should generate the attachment actions", () => {
    const attachments = { field_1: [{ attachment: "attachment-data" }], field_2: [{ _destroy: 1 }] };

    processAttachments({ attachments, id: 10, recordType: RECORD_PATH.cases });

    expect(queue).to.have.been.calledWith([
      {
        type: `${RECORD_PATH.cases}/SAVE_ATTACHMENT`,
        api: {
          path: `${RECORD_PATH.cases}/10/attachments`,
          method: METHODS.POST,
          body: { data: { attachment: "attachment-data", field_name: "field_1" } },
          db: { collection: "records", id: 10, recordType: "cases" }
        },
        fromQueue: "1234",
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
        fromAttachment: { id: 1, field_name: "field_2", record_type: RECORD_PATH.cases, record: { id: 10 } }
      }
    ]);
  });
});
