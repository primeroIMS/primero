import { Map, fromJS } from "immutable";

import { mapObjectPropertiesToRecords, mapListToObject } from "../../libs";

import Actions from "./actions";
import NAMESPACE from "./namespace";
import { ListHeaderRecord, FilterRecord } from "./records";

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
      return DEFAULT_STATE;
    case Actions.FETCH_USER_DATA_SUCCESS: {
      const {
        module_unique_ids: modules,
        permissions,
        role_unique_id: roleId,
        list_headers: listHeaders,
        filters
      } = payload;

      return state.merge(
        fromJS({
          modules,
          permissions: mapListToObject(permissions.list, "resource", "actions"),
          roleId,
          listHeaders: mapObjectPropertiesToRecords(
            listHeaders,
            ListHeaderRecord
          ),
          filters: mapObjectPropertiesToRecords(filters, FilterRecord)
        })
      );
    }
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
