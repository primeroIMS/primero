import { OrderedMap, Map } from "immutable";

import { mapEntriesToRecord } from "../../../../libs";
import { normalizeFormData } from "../../../../schemas";
import { FieldRecord, FormSectionRecord } from "../../../record-form/records";

import actions from "./actions";

const DEFAULT_STATE = Map({
  formSections: OrderedMap({}),
  fields: OrderedMap({})
});

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.RECORD_FORMS_SUCCESS:
      if (payload) {
        const { fields, formSections } = normalizeFormData(
          payload.data
        ).entities;

        return state
          .set("fields", mapEntriesToRecord(fields, FieldRecord, true))
          .set(
            "formSections",
            mapEntriesToRecord(formSections, FormSectionRecord, true)
          );
      }

      return state;
    case actions.RECORD_FORMS_FAILURE:
      return state.set("errors", true);
    case actions.RECORD_FORMS_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.RECORD_FORMS_FINISHED:
      return state.set("loading", false);
    default:
      return state;
  }
};

export default { forms: reducer };
