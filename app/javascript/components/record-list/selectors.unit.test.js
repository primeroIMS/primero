// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { FieldRecord } from "../form";

import * as selectors from "./selectors";

const agencies = fromJS([
  { name: "Name", field_name: "agency.name", id_search: false },
  {
    name: "Description",
    field_name: "agency.description",
    id_search: false
  }
]);
const field = FieldRecord({
  display_name: "Test Field 1",
  name: "test_field_1",
  type: "text_field"
});

const metadata = fromJS({
  total: 24,
  per: 20,
  page: 1
});

const stateWithoutRecords = fromJS({});
const stateWithRecords = fromJS({
  user: {
    listHeaders: {
      agencies
    }
  },
  forms: {
    fields: field
  },
  records: {
    cases: {
      metadata,
      filters: { disabled: ["true"] }
    }
  }
});

describe("<RecordList /> - Selectors", () => {
  describe("getFields", () => {
    it("should return all fields", () => {
      const values = selectors.getFields(stateWithRecords);

      expect(values).toEqual(field);
    });

    it("should return undefined when there are not messages in store", () => {
      const values = selectors.getFields(stateWithoutRecords);

      expect(values.size).toBe(0);
    });
  });

  describe("getMetadata", () => {
    it("should return all metadata", () => {
      const values = selectors.getMetadata(stateWithRecords, "cases");

      expect(values).toEqual(metadata);
    });

    it("should return an empty object when there are not metadata in store", () => {
      const values = selectors.getMetadata(stateWithoutRecords);

      expect(values.size).toBe(0);
    });
  });

  describe("getAppliedFilters", () => {
    it("should return the filters", () => {
      const values = selectors.getAppliedFilters(stateWithRecords, "cases");

      expect(values).toEqual(fromJS({ disabled: ["true"] }));
    });

    it("should return an empty object when there are not metadata in store", () => {
      const values = selectors.getAppliedFilters(stateWithoutRecords);

      expect(values.size).toBe(0);
    });
  });

  describe("getAppliedFiltersAsQueryString", () => {
    it("returns a query string with the current filters", () => {
      const queryString = selectors.getAppliedFiltersAsQueryString(stateWithRecords, "cases");

      expect(queryString).toBe("disabled%5B0%5D=true");
    });
  });
});
