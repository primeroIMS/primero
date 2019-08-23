import { Map, fromJS } from "immutable";
import { mapEntriesToRecord } from "libs";
import NAMESPACE from "./namespace";
import * as Actions from "./actions";
import * as R from "./records";

const DEFAULT_STATE = Map({
  selectedForm: null,
  formSections: {},
  fields: {}
});

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SELECTED_RECORD_SUCCESS:
      return state
        .set("selectedRecord", fromJS(payload.data))
        .set("errors", false);
    case Actions.SELECTED_RECORD_STARTED:
      return state.set("selectedRecord", null).set("loading", true);
    case Actions.SELECTED_RECORD_FAILURE:
      return state.set("errors", true);
    case Actions.SELECTED_RECORD_FINISHED:
      return state.set("loading", false);
    case Actions.SET_OPTIONS:
      return state.set("options", fromJS(payload));
    case Actions.RECORD_FORMS_SUCCESS:
      if (payload) {
        return state
          .set("fields", mapEntriesToRecord(payload.fields, R.FieldRecord))
          .set(
            "formSections",
            mapEntriesToRecord(payload.formSections, R.FormSectionRecord)
          );
      }
      return state;
    case Actions.RECORD_FORMS_FAILURE:
      return state.set("errors", true);
    case Actions.RECORD_FORMS_STARTED:
      return state.set("loading", true).set("errors", false);
    case Actions.RECORD_FORMS_FINISHED:
      return state.set("loading", false);
    case Actions.SET_SELECTED_FORM:
      return state.set("selectedForm", payload);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
