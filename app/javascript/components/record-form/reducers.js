import { Map } from "immutable";
import { mapEntriesToRecord } from "libs";
import NAMESPACE from "./namespace";
import * as Actions from "./actions";
import * as R from "./records";

const DEFAULT_STATE = Map({ selectedForm: null, formSections: {}, fields: {} });

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_FORMS:
      if (payload) {
        return state
          .set("fields", mapEntriesToRecord(payload.fields, R.FieldRecord))
          .set(
            "formSections",
            mapEntriesToRecord(payload.formSections, R.FormSectionRecord)
          );
      }
      return state;
    case Actions.SET_SELECTED_FORM:
      return state.set("selectedForm", payload);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
