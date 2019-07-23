import { expect } from "chai";
import "test/test.setup";
import { List, Map } from "immutable";

import { buildTableColumns } from "./helpers";

const i18n = { t: name => {
  name = name.split('.')[1];
  return name.charAt(0).toUpperCase() + name.slice(1)
}};

describe("<RecordList /> - buildTableColumns", () => {
  it("should return list of columns for table", () => {
    const expected = [
      { label: "Id", name: "id", id: true, options: {} },
      { label: "Name", name: "name", id: false, options: {} }
    ];

    const records = List([
      Map({
        id: "test",
        name: "james"
      })
    ]);

    const columns = buildTableColumns(records, "testRecordType", i18n);

    columns.forEach((v, k) => {
      expect(v).to.deep.equal(expected[k + 1]);
    })
  });
});
