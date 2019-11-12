import chai, { expect } from "chai";
import { fromJS } from "immutable";
import { mapEntriesToRecord } from "../../libs";
import chaiImmutable from "chai-immutable";

import { SavedSearchesRecord } from "./records";
import { reducers } from "./reducers";

chai.use(chaiImmutable);

describe("<SavedSearches /> - Reducers", () => {
  const defaultState = fromJS({
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
    const expected = fromJS({
      data: mapEntriesToRecord(payloadFilters, SavedSearchesRecord)
    });
    const action = {
      type: "savedSearches/FETCH_SAVED_SEARCHES_SUCCESS",
      payload: {
        data: payloadFilters
      }
    };

    const newState = reducers.savedSearches(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle REMOVE_SAVED_SEARCH_SUCCESS", () => {
    const defaultStateSavedSearch = fromJS({
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
        SavedSearchesRecord
      )
    });
    const expected = fromJS({
      data: []
    });
    const action = {
      type: "savedSearches/REMOVE_SAVED_SEARCH_SUCCESS",
      payload: {
        data: {
          id: 1
        }
      }
    };

    const newState = reducers.savedSearches(defaultStateSavedSearch, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_SEARCH_SUCCESS", () => {
    const defaultStateSuccess = fromJS({
      data: []
    });

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
    const expected = fromJS({
      data: mapEntriesToRecord(payloadFilters, SavedSearchesRecord)
    });
    const action = {
      type: "savedSearches/SAVE_SEARCH_SUCCESS",
      payload: {
        data: fromJS([
          SavedSearchesRecord({
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
          SavedSearchesRecord({
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
        ])
      }
    };

    const newState = reducers.savedSearches(defaultStateSuccess, action);
    expect(newState.toJS().data[0]).to.eql(expected.get("data").toJS());
  });
});
