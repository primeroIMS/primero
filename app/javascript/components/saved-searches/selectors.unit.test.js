// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map, List } from "immutable";

import { mapEntriesToRecord } from "../../libs";

import * as R from "./records";
import * as selectors from "./selectors";

const filters = [
  {
    id: 1,
    name: "a new filter",
    record_type: "incidents",
    module_ids: ["primeromodule-cp", "primeromodule-gbv"],
    filters: [
      {
        name: "Flag",
        value: ["true", "false"]
      }
    ]
  },
  {
    id: 33,
    name: "Hello 1",
    record_type: "incidents",
    module_ids: ["primeromodule-cp", "primeromodule-gbv"],
    filters: [
      {
        name: "status",
        value: ["open"]
      }
    ]
  }
];
const stateWithNoRecords = Map({
  records: Map({
    savedSearches: Map({
      data: List([])
    })
  })
});
const stateWithRecords = Map({
  records: Map({
    savedSearches: Map({
      data: mapEntriesToRecord(filters, R.SavedSearchesRecord)
    })
  })
});

describe("<SavedSearches /> - Selectors", () => {
  describe("selectSavedSearches", () => {
    it("should return list of filters saved", () => {
      const expected = List([
        R.SavedSearchesRecord({
          id: 1,
          name: "a new filter",
          record_type: "incidents",
          module_ids: ["primeromodule-cp", "primeromodule-gbv"],
          filters: [
            {
              name: "Flag",
              value: ["true", "false"]
            }
          ]
        }),
        R.SavedSearchesRecord({
          id: 33,
          name: "Hello 1",
          record_type: "incidents",
          module_ids: ["primeromodule-cp", "primeromodule-gbv"],
          filters: [
            {
              name: "status",
              value: ["open"]
            }
          ]
        })
      ]);
      const filtersFromState = selectors.selectSavedSearches(stateWithRecords, "incidents");

      expect(filtersFromState.toJS()).toEqual(expected.toJS());
    });

    it("should return false when there is not any error", () => {
      const errors = selectors.selectSavedSearches(stateWithNoRecords);

      expect(errors).toEqual(List([]));
    });
  });

  describe("selectSavedSearchesById", () => {
    it("should return saved filter", () => {
      const expected = List([
        R.SavedSearchesRecord({
          id: 1,
          name: "a new filter",
          record_type: "incidents",
          module_ids: ["primeromodule-cp", "primeromodule-gbv"],
          filters: [
            {
              name: "Flag",
              value: ["true", "false"]
            }
          ]
        })
      ]);
      const filtersFromState = selectors.selectSavedSearchesById(stateWithRecords, "incidents", 1);

      expect(filtersFromState.toJS()).toEqual(expected.toJS());
    });

    it("should return false when there is not any error", () => {
      const errors = selectors.selectSavedSearchesById(stateWithNoRecords);

      expect(errors).toEqual(Map({}));
    });
  });
});
