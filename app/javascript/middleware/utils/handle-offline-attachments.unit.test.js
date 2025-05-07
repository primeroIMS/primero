// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as syncIndexedDB from "../../db/sync";

import { skipSyncedAttachments, buildDBPayload } from "./handle-offline-attachments";

jest.mock("../../db/sync", () => {
  const originalModule = jest.requireActual("../../db/sync");

  return {
    __esModule: true,
    ...originalModule
  };
});

describe("middleware/utils/handle-offline-attachments.js", () => {
  const stateWithFields = fromJS({ forms: { attachmentMeta: { fields: ["photos", "audios"] } } });

  const photo1 = { id: 1, url: "photo-1.jpg" };
  const photo2 = { id: 2, url: "photo-2.jpg" };

  beforeEach(async () => {
    jest.spyOn(syncIndexedDB, "default").mockResolvedValue({ data: { photos: [photo1] } });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("buildDBPayload", () => {
    it("should return the payload once the record was merged", async () => {
      const store = { getState: () => stateWithFields };

      const expected = { data: { photos: [photo1, photo2] } };

      const dbPayload = await buildDBPayload(store, { api: { id: "123a", body: { data: { photos: [photo2] } } } });

      expect(dbPayload).toEqual(expected);
    });
  });

  describe("skipSyncedAttachments", () => {
    it("should get rid of the already synchronized attachments", async () => {
      const store = { getState: () => stateWithFields };

      const expected = { api: { id: "a123", body: { data: { photos: [photo2] } } } };

      const dbPayload = await skipSyncedAttachments(store, {
        api: { id: "a123", body: { data: { photos: [photo1, photo2] } } }
      });

      expect(dbPayload).toEqual(expected);
    });
  });
});
