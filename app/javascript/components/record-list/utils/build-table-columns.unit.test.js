// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildTableColumns from "./build-table-columns";

const i18n = {
  t: name => {
    const fragment = name.split(".")[1];

    return fragment.charAt(0).toUpperCase() + fragment.slice(1);
  }
};

describe("<RecordList />/utils - buildTableColumns", () => {
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

    const listHeaders = fromJS([
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

    const columns = buildTableColumns(listHeaders, i18n, "testRecordType", true)(fromJS([]));

    columns.forEach((v, k) => {
      expect(v.id).toBe(expected[k].id);
      expect(v.name).toBe(expected[k].name);
      expect(v.label).toBe(expected[k].label);
      expect(v).toHaveProperty("options");
    });
  });
});
