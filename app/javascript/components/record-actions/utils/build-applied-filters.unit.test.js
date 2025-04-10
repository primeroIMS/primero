// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildAppliedFilters from "./build-applied-filters";

describe("record-actions/utils/build-applied-filters", () => {
  const record = fromJS({
    record_state: true,
    sex: "female",
    date_of_birth: "2005-01-29",
    case_id: "1b21e684-c6b1-4e74-b148-317a2b575f47",
    created_at: "2020-01-29T21:57:00.274Z",
    name: "User 1",
    alert_count: 0,
    case_id_display: "b575f47",
    created_by: "primero_cp_ar",
    module_id: "primeromodule-cp",
    owned_by: "primero_cp",
    status: "open",
    registration_date: "2020-01-29",
    complete: true,
    type: "cases",
    id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
    name_first: "User",
    short_id: "b575f47",
    age: 15,
    workflow: "new"
  });
  const appliedFilters = fromJS({
    sex: ["female"]
  });
  const recordIds = [record.get("id")];

  it("should be a function", () => {
    expect(buildAppliedFilters).toBeInstanceOf(Function);
  });

  it("should return filters with short_id, if isShowPage true", () => {
    const expected = { filters: { id: recordIds } };

    expect(buildAppliedFilters(true, false, recordIds, appliedFilters, {}, record, false)).toEqual(expected);
  });

  it("should return filters without page, per and total params", () => {
    const expected = { filters: { id: recordIds } };
    const filters = fromJS({
      sex: ["female"],
      page: 1,
      total: 40,
      per: 5
    });

    expect(buildAppliedFilters(true, false, recordIds, filters, {}, record, false)).toEqual(expected);
  });

  it(
    "should return filters with short_id, " +
      "if isShowPage is false and allRowsSelected is false and there are not appliedFilters",
    () => {
      const expected = { filters: { id: recordIds } };

      expect(buildAppliedFilters(false, false, recordIds, fromJS({}), {}, record, false)).toEqual(expected);
    }
  );

  it("should return and object with applied filters, if isShowPage is false and allRowsSelected is true", () => {
    const expected = { filters: { id: recordIds } };

    expect(buildAppliedFilters(false, true, recordIds, appliedFilters, {}, record, false)).toEqual(expected);
  });

  it(
    "should return and object with short_id, and query " +
      "if isShowPage is false, allRowsSelected is false and a query is specified",
    () => {
      const query = "test";
      const expected = { filters: { id: recordIds } };

      expect(buildAppliedFilters(false, true, recordIds, fromJS({ query }), {}, record, false)).toEqual(expected);
    }
  );

  it(
    "should return and object with applied filters and query, " +
      "if isShowPage is false, allRowsSelected is true and a query is specified",
    () => {
      const query = "test";
      const expected = { filters: { id: recordIds } };

      expect(buildAppliedFilters(false, true, recordIds, fromJS({ query }), {}, record, false)).toEqual(expected);
    }
  );

  it("should return and object with default filter if allRecordsSelected are selected", () => {
    const expected = {
      filters: {
        status: ["open"],
        record_state: ["true"]
      }
    };

    expect(buildAppliedFilters(false, false, recordIds, fromJS({}), {}, record, true)).toEqual(expected);
  });
});
