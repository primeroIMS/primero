// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import useSystemStrings from "../../application/use-system-strings";
import { setupHook } from "../../../test-utils";
import { useApp } from "../../application";

import buildTableColumns from "./build-table-columns";

const i18n = {
  t: name => {
    const fragment = name.split(".")[1];

    return fragment.charAt(0).toUpperCase() + fragment.slice(1);
  }
};

jest.mock("../../application/use-app");

describe("<RecordList />/utils - buildTableColumns", () => {
  beforeEach(() => {
    useApp.mockReturnValue({
      fieldLabels: fromJS({})
    });
  });

  it("should return list of columns for table", () => {
    const { result } = setupHook(() => useSystemStrings("listHeader"));

    const expected = [
      { label: "testRecordType.james", name: "James", id: false, options: {} },
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

    const columns = buildTableColumns(
      listHeaders,
      i18n,
      "testRecordType",
      true,
      null,
      true,
      false,
      {},
      result.current.label
    )(fromJS([]));

    columns.forEach((v, k) => {
      expect(v.id).toBe(expected[k].id);
      expect(v.name).toBe(expected[k].name);
      expect(v.label).toBe(expected[k].label);
      expect(v).toHaveProperty("options");
    });
  });
});
