import { OrderedMap, Map, fromJS } from "immutable";

import { mapEntriesToRecord, listAttachmentFields } from "../../libs";

import NAMESPACE from "./namespace";
import Actions from "./actions";
import { FieldRecord, FormSectionRecord } from "./records";

const DEFAULT_STATE = Map({
  selectedForm: null,
  selectedRecord: null,
  formSections: OrderedMap({}),
  fields: OrderedMap({})
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.CLEAR_VALIDATION_ERRORS:
      return state.delete("validationErrors");
    case Actions.FETCH_AGENCIES_FAILURE:
      return state.setIn(["options", "errors"], true);
    case Actions.FETCH_AGENCIES_FINISHED:
      return state.setIn(["options", "loading"], false);
    case Actions.FETCH_AGENCIES_STARTED:
      return state.setIn(["options", "loading"], true);
    case Actions.FETCH_AGENCIES_SUCCESS:
      return state.setIn(["options", "agencies"], fromJS(payload.data)).setIn(["options", "errors"], false);
    case Actions.RECORD_FORMS_FAILURE:
      return state.set("errors", true);
    case Actions.RECORD_FORMS_FINISHED:
      return state.set("loading", false);
    case Actions.RECORD_FORMS_STARTED:
      return state.set("loading", true).set("errors", false);
    case Actions.RECORD_FORMS_SUCCESS:
      if (payload) {
        return state
          .set("attachmentMeta", fromJS(listAttachmentFields(payload.formSections, payload.fields)))
          .set("fields", mapEntriesToRecord(payload.fields, FieldRecord, true))
          .set("formSections", mapEntriesToRecord(payload.formSections, FormSectionRecord, true));
      }

      return state;
    case Actions.SET_OPTIONS_SUCCESS:
      return state.setIn(["options", "lookups"], fromJS(payload));
    case Actions.SET_LOCATIONS_SUCCESS:
      return state.setIn(["options", "locations"], fromJS(payload));
    case Actions.SET_SELECTED_FORM:
      return state.set("selectedForm", payload);
    case Actions.SET_SELECTED_RECORD:
      return state.set("selectedRecord", payload);
    case Actions.SET_PREVIOUS_RECORD:
      return state.set("previousRecord", payload);
    case Actions.CLEAR_PREVIOUS_RECORD:
      return state.delete("previousRecord");
    case Actions.SET_SERVICE_TO_REFER:
      return state.set("serviceToRefer", fromJS(payload));
    case Actions.SET_VALIDATION_ERRORS:
      return state.set("validationErrors", fromJS(payload));
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    case Actions.SET_DATA_PROTECTION_INITIAL_VALUES:
      return state.set("dataProtectionInitialValues", fromJS(payload));
    case Actions.CLEAR_DATA_PROTECTION_INITIAL_VALUES:
      return state.delete("dataProtectionInitialValues");
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
