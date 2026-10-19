import { fromJS } from "immutable";

import buildSelectedIds from "./build-selected-ids";

describe("record-actions/utils/build-selected-ids", () => {
  const records = fromJS([
    { id: "1", registry_record_id: "r1" },
    { id: "2", registry_record_id: "r2" },
    { id: "3", registry_record_id: "r3" }
  ]);
  const selectedRecords = { 0: [0, 2] };

  it("returns the ids of the selected records in the current page", () => {
    expect(buildSelectedIds(selectedRecords, records, 0)).toEqual(["1", "3"]);
  });

  it("returns the value of the given key", () => {
    expect(buildSelectedIds(selectedRecords, records, 0, "registry_record_id")).toEqual(["r1", "r3"]);
  });

  it("excludes the records with the given ids", () => {
    expect(buildSelectedIds(selectedRecords, records, 0, "registry_record_id", ["1"])).toEqual(["r3"]);
  });

  it("returns an empty array when there are no records", () => {
    expect(buildSelectedIds(selectedRecords, undefined, 0)).toEqual([]);
  });
});
