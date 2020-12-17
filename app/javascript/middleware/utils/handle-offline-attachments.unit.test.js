import { fromJS } from "immutable";

import { stub } from "../../test";
import * as syncIndexedDB from "../../db/sync";

import { skipSyncedAttachments, buildDBPayload } from "./handle-offline-attachments";

describe("middleware/utils/handle-offline-attachments.js", () => {
  const stateWithFields = fromJS({ forms: { attachmentMeta: { fields: ["photos", "audios"] } } });

  describe("buildDBPayload", () => {
    let sync;
    const photo1 = { id: 1, url: "photo-1.jpg" };
    const photo2 = { id: 2, url: "photo-2.jpg" };

    beforeEach(() => {
      sync = stub(syncIndexedDB, "default").resolves({ data: { photos: [photo1] } });
    });

    it("should return the payload once the record was merged", async () => {
      const store = { getState: () => stateWithFields };

      const expected = { data: { photos: [photo1, photo2] } };

      const dbPayload = await buildDBPayload(store, { api: { body: { data: { photos: [photo2] } } } });

      expect(dbPayload).to.deep.equal(expected);
    });

    afterEach(() => {
      sync.restore();
    });
  });

  describe("skipSyncedAttachments", async () => {
    let sync;
    const photo1 = { id: 1, url: "photo-1.jpg" };
    const photo2 = { id: 2, url: "photo-2.jpg" };

    beforeEach(() => {
      sync = stub(syncIndexedDB, "default").resolves({ data: { photos: [photo1] } });
    });

    it("should get rid of the already synchronized attachments", async () => {
      const store = { getState: () => stateWithFields };

      const expected = { api: { body: { data: { photos: [photo2] } } } };

      const dbPayload = await skipSyncedAttachments(store, { api: { body: { data: { photos: [photo1, photo2] } } } });

      expect(dbPayload).to.deep.equal(expected);
    });

    afterEach(() => {
      sync.restore();
    });
  });
});
