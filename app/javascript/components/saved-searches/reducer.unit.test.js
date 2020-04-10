import { fromJS } from "immutable";

import { mapEntriesToRecord } from "../../libs";

import { SavedSearchesRecord } from "./records";
import reducer from "./reducer";

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

    const newState = reducer.savedSearches(defaultState, action);

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

    const newState = reducer.savedSearches(defaultStateSavedSearch, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_SEARCH_SUCCESS", () => {
    const defaultStateSuccess = fromJS({
      data: []
    });

    const expected = {
      data: [
        {
          id: 1,
          name: "a new filter",
          record_type: "incidents",
          user_id: null,
          message: "",
          filters: [
            {
              name: "Flag",
              value: ["true", "false"]
            },
            {
              name: "inquiry_status",
              value: ["open"]
            }
          ]
        }
      ]
    };

    const action = {
      type: "savedSearches/SAVE_SEARCH_SUCCESS",
      payload: {
        data: {
          id: 1,
          name: "a new filter",
          record_type: "incidents",
          filters: [
            {
              name: "Flag",
              value: ["true", "false"]
            },
            {
              name: "inquiry_status",
              value: ["open"]
            }
          ]
        }
      }
    };

    const newState = reducer.savedSearches(defaultStateSuccess, action);

    // Using toJS(), because SavedSearchesRecord doesn't implement immutable js
    expect(newState.toJS()).to.deep.equal(expected);
  });
});
