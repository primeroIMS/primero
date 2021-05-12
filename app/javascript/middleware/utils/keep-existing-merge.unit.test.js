import merge from "deepmerge";

import keepExistingMerge from "./keep-existing-merge";

describe("keepExistingMerge", () => {
  context("objects already exist", () => {
    it("adds new objects", () => {
      const target = [
        { unique_id: "1", field_1: "value_1" },
        { unique_id: "2", field_1: "value_2" }
      ];
      const source = [{ unique_id: "3", field_1: "value_3" }];

      const expected = [...target, ...source];

      expect(merge(target, source, { arrayMerge: keepExistingMerge })).to.deep.equal(expected);
    });

    it("merges existing objects and add new objects", () => {
      const target = [
        { unique_id: "1", field_1: "value_1" },
        { unique_id: "2", field_1: "value_2" }
      ];
      const source = [
        { unique_id: "2", field_1: "value_2", _destroy: true },
        { unique_id: "3", field_1: "value_3" }
      ];

      const expected = [{ unique_id: "1", field_1: "value_1" }, ...source];

      expect(merge(target, source, { arrayMerge: keepExistingMerge })).to.deep.equal(expected);
    });

    it("merges existing objects and add new fields", () => {
      const target = [
        { unique_id: "1", field_1: "value_1" },
        { unique_id: "2", field_1: "value_2" }
      ];
      const source = [
        { unique_id: "2", field_1: "value_2", field_2: "value_1" },
        { unique_id: "3", field_1: "value_3" }
      ];

      const expected = [{ unique_id: "1", field_1: "value_1" }, ...source];

      expect(merge(target, source, { arrayMerge: keepExistingMerge })).to.deep.equal(expected);
    });
  });

  context("attachments already exist", () => {
    it("adds new attachments", () => {
      const target = [
        { attachment: "cde", file_name: "file_1" },
        { attachment: "abc", fie: "file_2" }
      ];
      const source = [{ attachment: "fgh", fie: "file_3" }];

      const expected = [...target, ...source];

      expect(merge(target, source, { arrayMerge: keepExistingMerge })).to.deep.equal(expected);
    });

    it("adds new attachments", () => {
      const target = [
        { attachment: "cde", file_name: "file_1" },
        { attachment: "abc", fie: "file_2" }
      ];
      const source = [{ attachment: "fgh", fie: "file_3" }];

      const expected = [...target, ...source];

      expect(merge(target, source, { arrayMerge: keepExistingMerge })).to.deep.equal(expected);
    });
  });
});
