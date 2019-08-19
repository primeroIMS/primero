import { Map } from "immutable";
import { mapEntriesToRecord } from "libs";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";
import * as R from "./records";

const DEFAULT_STATE = Map({
  data: []
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_AGENCY_LOGO_SUCCESS:
      return state.set(
        "data",
        mapEntriesToRecord(payload.data.agencies, R.AgencyRecord)
      );
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
