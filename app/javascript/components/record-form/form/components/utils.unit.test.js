import * as utils from "./utils";
import { SYNC_RECORD_STATUS } from "./constants";

describe("<RecordForm>/form/components - utils", () => {
  describe("removeEmptyArrays", () => {
    it("removes empty arrays from object", () => {
      const current = {
        field1: "value field1",
        field2: [],
        field3: [{ subfield1: "value subfield1" }]
      };
      const expected = {
        field1: "value field1",
        field3: [{ subfield1: "value subfield1" }]
      };

      expect(utils.removeEmptyArrays(current)).to.deep.equal(expected);
    });
  });
  describe("buildLabelSync", () => {
    let syncedAt;
    let i18n;

    beforeEach(() => {
      syncedAt = "2021-02-10T12:50:32";
      i18n = { t: val => val, localizeDate: val => val };
    });

    it("build label for synced status", () => {
      const syncedStatus = SYNC_RECORD_STATUS.synced;
      const expected = "sync_record.last";

      expect(utils.buildLabelSync(syncedStatus, syncedAt, i18n)).to.deep.equal(expected);
    });

    it("build label for failed status", () => {
      const syncedStatus = SYNC_RECORD_STATUS.failed;
      const expected = "sync_record.failed";

      expect(utils.buildLabelSync(syncedStatus, syncedAt, i18n)).to.deep.equal(expected);
    });

    it("build label for not_found status", () => {
      const syncedStatus = SYNC_RECORD_STATUS.not_found;
      const expected = "sync_record.not_found";

      expect(utils.buildLabelSync(syncedStatus, syncedAt, i18n)).to.deep.equal(expected);
    });
  });
});
