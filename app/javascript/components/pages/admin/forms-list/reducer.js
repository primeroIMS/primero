import { OrderedMap, Map, fromJS } from "immutable";

import { mapEntriesToRecord } from "../../../../libs";
import { normalizeFormData } from "../../../../schemas";
import { FieldRecord, FormSectionRecord } from "../../../record-form/records";

import { formSectionFilter } from "./selectors";
import { reorderElems } from "./utils";
import { ORDER_STEP } from "./constants";
import actions from "./actions";

const DEFAULT_STATE = Map({
  formSections: OrderedMap({}),
  fields: OrderedMap({})
});

const getFormGroupId = (state, formUniqueId) =>
  state.get("formSections").find(form => form.get("unique_id") === formUniqueId)
    .form_group_id;

const setInitialFormOrder = (state, filter) =>
  state
    .get("formSections")
    .filter(formSection => formSectionFilter(formSection, filter))
    .sortBy(formSection => formSection.order)
    .valueSeq()
    .map((formSection, index) => formSection.set("order", index * 10));

const setInitialGroupOrder = (state, filter) =>
  state
    .get("formSections")
    .filter(formSection => formSectionFilter(formSection, filter))
    .sortBy(formSection => formSection.order_form_group)
    .groupBy(fs => fs.form_group_id)
    .entrySeq()
    .map((entry, index) =>
      entry[1].map(form => form.set("order_form_group", index * 10))
    )
    .flatten();

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.CLEAR_FORMS_REORDER:
      return state.set("reorderedForms", fromJS({}));
    case actions.ENABLE_REORDER:
      return state.setIn(["reorderedForms", "enabled"], payload);
    case actions.RECORD_FORMS_SUCCESS: {
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
    }
    case actions.RECORD_FORMS_FAILURE:
      return state.set("errors", true);
    case actions.RECORD_FORMS_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.RECORD_FORMS_FINISHED:
      return state.set("loading", false);
    case actions.REORDER_FORM_GROUPS: {
      const { filter, formGroupId, order } = payload;

      const formSections = setInitialGroupOrder(state, filter);

      const reorderedForms = reorderElems({
        fieldsMeta: {
          idField: "form_group_id",
          keyField: "id",
          orderField: "order_form_group"
        },
        orderMeta: {
          step: ORDER_STEP,
          target: order
        },
        elemId: formGroupId,
        elems: formSections
      });

      return state.set(
        "formSections",
        state.get("formSections").merge(reorderedForms)
      );
    }
    case actions.REORDER_FORM_SECTIONS: {
      const { filter, id, order } = payload;

      const formGroupId = getFormGroupId(state, id);

      const formSections = setInitialFormOrder(state, {
        ...filter,
        formGroupId
      });

      const reorderedForms = reorderElems({
        fieldsMeta: {
          idField: "unique_id",
          keyField: "id",
          orderField: "order"
        },
        orderMeta: {
          step: ORDER_STEP,
          target: order
        },
        elemId: id,
        elems: formSections
      });

      return state.set(
        "formSections",
        state.get("formSections").merge(reorderedForms)
      );
    }
    case actions.SAVE_FORMS_REORDER_STARTED:
      return state.setIn(["reorderedForms", "loading"], true);
    case actions.SAVE_FORMS_REORDER_SUCCESS: {
      const reordered = payload
        .filter(data => data.ok)
        .map(data => data.json.data.id);

      const errors = payload
        .filter(data => data.ok === false)
        .map(data => data.json || data.error);

      const pending = state
        .getIn(["reorderedForms", "pending"], fromJS([]))
        .filter(id => !reordered.includes(id));

      return state
        .setIn(["reorderedForms", "pending"], pending)
        .setIn(["reorderedForms", "errors"], fromJS(errors));
    }
    case actions.SAVE_FORMS_REORDER_FINISHED:
      return state
        .setIn(["reorderedForms", "loading"], payload)
        .setIn(["reorderedForms", "finished"], true);
    case actions.SET_REORDERED_FORMS:
      return state.setIn(["reorderedForms", "pending"], fromJS(payload.ids));
    default:
      return state;
  }
};
