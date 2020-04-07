import { fromJS } from "immutable";

import { mapListToObject, mapObjectPropertiesToRecords } from "../../libs";

import reducers from "./reducers";
import Actions from "./actions";
import { FilterRecord, ListHeaderRecord } from "./records";

describe("User - Reducers", () => {
  const initialState = fromJS({
    isAuthenticated: false
  });

  it("should handle SET_AUTHENTICATED_USER", () => {
    const expected = fromJS({
      isAuthenticated: true,
      id: 1,
      username: "primero"
    });
    const payload = {
      id: 1,
      username: "primero"
    };
    const action = {
      type: Actions.SET_AUTHENTICATED_USER,
      payload
    };

    const newState = reducers.user(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle LOGOUT_SUCCESS", () => {
    const action = {
      type: Actions.LOGOUT_SUCCESS
    };

    const newState = reducers.user(initialState, action);

    expect(newState).to.deep.equal(initialState);
  });

  it("should handle FETCH_USER_DATA_SUCCESS", () => {
    const expected = fromJS({
      isAuthenticated: false,
      modules: ["primeromodule-cp", "primeromodule-gbv"],
      permissions: mapListToObject(
        [
          {
            resource: "cases",
            actions: ["manage", "referral", "receive_referral"]
          }
        ],
        "resource",
        "actions"
      ),
      roleId: 19,
      listHeaders: mapObjectPropertiesToRecords(
        {
          cases: [
            {
              name: "age",
              field_name: "age",
              id_search: true
            }
          ]
        },
        ListHeaderRecord
      ),
      filters: mapObjectPropertiesToRecords(
        {
          cases: [
            {
              name: "cases.filter_by.flag",
              field_name: "flagged",
              options: {
                en: [
                  {
                    id: "true",
                    display_name: "Flagged?"
                  }
                ]
              },
              type: "toggle"
            }
          ]
        },
        FilterRecord
      )
    });
    const payload = {
      id: 1,
      full_name: "System Superuser",
      user_name: "primero",
      email: "primero@primero.com",
      agency_id: 1,
      role_unique_id: 19,
      module_unique_ids: ["primeromodule-cp", "primeromodule-gbv"],
      agency: 1,
      permissions: {
        list: [
          {
            resource: "cases",
            actions: ["manage", "referral", "receive_referral"]
          }
        ]
      },
      list_headers: {
        cases: [
          {
            name: "age",
            field_name: "age",
            id_search: true
          }
        ]
      },
      filters: {
        cases: [
          {
            name: "cases.filter_by.flag",
            field_name: "flagged",
            options: {
              en: [
                {
                  id: "true",
                  display_name: "Flagged?"
                }
              ]
            },
            type: "toggle"
          }
        ]
      }
    };
    const action = {
      type: Actions.FETCH_USER_DATA_SUCCESS,
      payload
    };

    const newState = reducers.user(initialState, action);

    // TODO: Remove .toJS()
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });
});
