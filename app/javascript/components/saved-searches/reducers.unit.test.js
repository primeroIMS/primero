import chai, { expect } from "chai";
import { Map, List } from "immutable";
import { mapEntriesToRecord } from "libs";
import chaiImmutable from "chai-immutable";
import * as R from "./records";
import * as r from "./reducers";

chai.use(chaiImmutable);

describe("<SavedSearches /> - Reducers", () => {
  const defaultState = Map({
    data: []
  });

  it("should handle FETCH_SAVED_SEARCHES_SUCCESS", () => {
    const payloadFilters = [
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
      }
    ];
    const expected = Map({
      data: mapEntriesToRecord(payloadFilters, R.SavedSearchesRecord)
    });
    const action = {
      type: "savedSearches/FETCH_SAVED_SEARCHES_SUCCESS",
      payload: {
        data: payloadFilters
      }
    };

    const newState = r.reducers.savedSearches(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle REMOVE_SAVED_SEARCH_SUCCESS", () => {
    const defaultStateSavedSearch = Map({
      data: mapEntriesToRecord(
        [
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
          }
        ],
        R.SavedSearchesRecord
      )
    });
    const expected = Map({
      data: List([])
    });
    const action = {
      type: "savedSearches/REMOVE_SAVED_SEARCH_SUCCESS",
      payload: {
        data: {
          id: 1
        }
      }
    };

    const newState = r.reducers.savedSearches(defaultStateSavedSearch, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_SEARCH_SUCCESS", () => {
    const payloadFilters = [
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
            name: "inquiry_status",
            value: ["open"]
          }
        ]
      }
    ];
    const expected = Map({
      data: mapEntriesToRecord(payloadFilters, R.SavedSearchesRecord)
    });
    const action = {
      type: "savedSearches/SAVE_SEARCH_SUCCESS",
      payload: {
        data: [
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
                name: "inquiry_status",
                value: ["open"]
              }
            ]
          })
        ]
      }
    };

    const newState = r.reducers.savedSearches(defaultState, action);
    expect(newState.toJS().data[0]).to.eql(expected.get("data").toJS());
  });
});
