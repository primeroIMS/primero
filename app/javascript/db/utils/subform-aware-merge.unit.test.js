import merge from "deepmerge";

import subformAwareMerge from "./subform-aware-merge";

describe("subformAwareMerge", () => {
  context("when merging primitive values", () => {
    it("adds items", () => {
      const target = [];
      const source = ["value_1", "value_2", "value_3"];
      const expected = [...source];

      expect(merge(target, source, { arrayMerge: subformAwareMerge })).to.deep.equal(expected);
    });

    it("removes items", () => {
      const target = ["value_1", "value_2"];
      const source = ["value_1"];
      const expected = [...source];

      expect(merge(target, source, { arrayMerge: subformAwareMerge })).to.deep.equal(expected);
    });
  });

  context("when merging objects", () => {
    it("adds items", () => {
      const target = [];
      const source = [
        { id: 1, field: "value_1" },
        { id: 2, field: "value_2" }
      ];
      const expected = [...source];

      expect(merge(target, source, { arrayMerge: subformAwareMerge })).to.deep.equal(expected);
    });

    it("removes item", () => {
      const target = [{ id: 2, field: "value_2" }];
      const source = [{ id: 1, field: "value_1" }];
      const expected = [...source];

      expect(merge(target, source, { arrayMerge: subformAwareMerge })).to.deep.equal(expected);
    });

    it("merges items by id", () => {
      const target = [
        { id: 1, field: "value_1" },
        { id: 2, field: "value_2" }
      ];
      const source = [
        { id: 1, new_field: "new_value_1" },
        { id: 2, field: "value_2" }
      ];
      const expected = [
        { id: 1, field: "value_1", new_field: "new_value_1" },
        { id: 2, field: "value_2" }
      ];

      expect(merge(target, source, { arrayMerge: subformAwareMerge })).to.deep.equal(expected);
    });

    it("merges items by unique_id", () => {
      const target = [
        { unique_id: "uid-1", field: "value_1" },
        { unique_id: "uid-2", field: "value_2" }
      ];
      const source = [
        { unique_id: "uid-1", new_field: "new_value_1" },
        { unique_id: "uid-2", field: "value_2" }
      ];
      const expected = [
        { unique_id: "uid-1", field: "value_1", new_field: "new_value_1" },
        { unique_id: "uid-2", field: "value_2" }
      ];

      expect(merge(target, source, { arrayMerge: subformAwareMerge })).to.deep.equal(expected);
    });
  });
});
