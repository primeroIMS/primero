import { expect } from "chai";
import "test/test.setup";
import { List, Map } from "immutable";

import { buildTableColumns } from "./helpers";

const i18n = {
  t: name => {
    name = name.split(".")[1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
};

describe("<RecordList /> - buildTableColumns", () => {
  it("should return list of columns for table", () => {
    const expected = [
      { label: "James", name: "James", id: false, options: {} }
    ];

    const records = List([
      {
        id_search: false,
        name: "james",
        field_name: "James"
      }
    ]);
    const columns = buildTableColumns(records, i18n, "testRecordType");
    columns.forEach((v, k) => {
      expect(v).to.deep.equal(expected[k]);
    });
  });
});
