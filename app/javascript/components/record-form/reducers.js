import { OrderedMap, Map, fromJS } from "immutable";

import { mapEntriesToRecord, listAttachmentFields } from "../../libs";

import { FIELD_ATTACHMENT_TYPES } from "./form/field-types/attachments/constants";
import NAMESPACE from "./namespace";
import Actions from "./actions";
import { FieldRecord, FormSectionRecord } from "./records";

const DEFAULT_STATE = Map({
  selectedForm: null,
  selectedRecord: null,
  formSections: OrderedMap({}),
  fields: OrderedMap({})
});

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_AGENCIES_FAILURE:
      return state.setIn(["options", "errors"], true);
    case Actions.FETCH_AGENCIES_FINISHED:
      return state.setIn(["options", "loading"], false);
    case Actions.FETCH_AGENCIES_STARTED:
      return state.setIn(["options", "loading"], true);
    case Actions.FETCH_AGENCIES_SUCCESS:
      return state
        .setIn(["options", "agencies"], fromJS(payload.data))
        .setIn(["options", "errors"], false);
    case Actions.FETCH_RECORD_ALERTS_SUCCESS:
      return state.set("recordAlerts", fromJS(payload.data));
    case Actions.RECORD_FORMS_FAILURE:
      return state.set("errors", true);
    case Actions.RECORD_FORMS_FINISHED:
      return state.set("loading", false);
    case Actions.RECORD_FORMS_STARTED:
      return state.set("loading", true).set("errors", false);
    case Actions.RECORD_FORMS_SUCCESS:
      if (payload) {
        return state
          .set(
            "attachmentFields",
            fromJS(
              listAttachmentFields(
                payload.fields,
                Object.keys(FIELD_ATTACHMENT_TYPES)
              )
            )
          )
          .set("fields", mapEntriesToRecord(payload.fields, FieldRecord, true))
          .set(
            "formSections",
            mapEntriesToRecord(payload.formSections, FormSectionRecord, true)
          );
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
    case Actions.SET_SERVICE_TO_REFER:
      return state.set("serviceToRefer", fromJS(payload));
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
