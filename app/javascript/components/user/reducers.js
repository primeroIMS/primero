import { Map, fromJS } from "immutable";
import { mapObjectPropertiesToRecords, mapListToObject } from "libs";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";
import * as Record from "./records";

const DEFAULT_STATE = Map({
  isAuthenticated: false
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_AUTHENTICATED_USER:
      return state
        .set("isAuthenticated", true)
        .set("id", payload.id)
        .set("username", payload.username);
    case Actions.LOGOUT_SUCCESS:
      return state.set("isAuthenticated", false).set("username", null);
    case Actions.FETCH_USER_DATA_SUCCESS: {
      const {
        modules,
        permissions,
        role_id: roleId,
        list_headers: listHeaders,
        filters
      } = payload.data;

      return state.merge(
        fromJS({
          modules,
          permissions: mapListToObject(permissions.list, "resource", "actions"),
          roleId,
          listHeaders: mapObjectPropertiesToRecords(
            listHeaders,
            Record.ListHeaderRecord
          ),
          filters: mapObjectPropertiesToRecords(filters, Record.FilterRecord)
        })
      );
    }

    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
