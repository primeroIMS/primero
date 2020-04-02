import { expect } from "chai";
import { fromJS } from "immutable";

import { buildTableColumns } from "./helpers";

const i18n = {
  t: name => {
    const fragment = name.split(".")[1];

    return fragment.charAt(0).toUpperCase() + fragment.slice(1);
  }
};

describe("<RecordList /> - buildTableColumns", () => {
  it("should return list of columns for table", () => {
    const expected = [
      { label: "James", name: "James", id: false, options: {} },
      {
        label: "",
        name: "alert_count",
        id: undefined,
        options: {}
      }
    ];

    const records = fromJS([
      {
        id_search: false,
        name: "james",
        field_name: "James"
      },
      {
        name: "alert_count",
        field_name: "alert_count"
      }
    ]);
    const columns = buildTableColumns(records, i18n, "testRecordType");

    columns.forEach((v, k) => {
      expect(v.id).to.equal(expected[k].id);
      expect(v.name).to.equal(expected[k].name);
      expect(v.label).to.equal(expected[k].label);
      expect(v).to.have.property("options");
    });
  });
});
