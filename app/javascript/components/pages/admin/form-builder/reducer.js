import { fromJS } from "immutable";

import actions from "./actions";
import { affectedOrderRange, buildOrderUpdater } from "./utils";
import { transformValues } from "./components/field-dialog/utils";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.CLEAR_SELECTED_FORM:
      return state
        .set("selectedForm", fromJS({}))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.FETCH_FORM_FAILURE:
      return state
        .set("errors", true)
        .set("serverErrors", fromJS(payload.errors));
    case actions.FETCH_FORM_FINISHED:
      return state.set("loading", fromJS(payload));
    case actions.FETCH_FORM_STARTED:
      return state
        .set("loading", fromJS(payload))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.FETCH_FORM_SUCCESS:
      return state
        .set("selectedForm", fromJS(payload.data))
        .set("selectedFields", fromJS(payload.data.fields))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.REORDER_FIELDS: {
      const { name, order, isSubform } = payload;
      const fieldsPath = isSubform
        ? ["selectedFieldSubform", "fields"]
        : ["selectedFields"];
      const selectedFields = state.getIn(fieldsPath, fromJS([]));

      const reorderedField = selectedFields.find(
        field => field.get("name") === name
      );
      const currentOrder = reorderedField.get("order");

      const affectedRange = affectedOrderRange(currentOrder, order);

      if (affectedRange.length === 0) {
        return state;
      }

      const orderUpdater = buildOrderUpdater(currentOrder, order);

      return state.setIn(
        fieldsPath,
        selectedFields
          .sortBy(field => field.get("order"))
          .map((field, index) => field.set("order", index))
          .map(field => {
            if (field.get("name") === name) {
              return field.set("order", order);
            }
            if (affectedRange.includes(field.get("order"))) {
              return orderUpdater(field);
            }

            return field;
          })
      );
    }
    case actions.SAVE_FORM_FAILURE:
      return state
        .set("errors", true)
        .set("serverErrors", fromJS(payload.errors));
    case actions.SAVE_FORM_FINISHED:
      return state.set("saving", false);
    case actions.SAVE_FORM_STARTED:
      return state
        .set("saving", true)
        .set("errors", false)
        .set("serverErrors", fromJS([]))
        .set("updatedFormIds", fromJS([]));
    case actions.SAVE_FORM_SUCCESS: {
      const formIds = payload
        .filter(data => data.ok)
        .map(data => data.json.data.id);

      const errors = payload
        .filter(data => data.ok === false)
        .map(data => data.json || data.error);

      if (errors.length) {
        return state.set("errors", true).set("serverErrors", fromJS(errors));
      }

      return state.set("updatedFormIds", fromJS(formIds));
    }
    case actions.SET_SELECTED_FIELD: {
      const selectedField = state
        .get("selectedFields", fromJS([]))
        .find(field => field.get("name") === payload.name);

      return state.set("selectedField", selectedField);
    }
    case actions.SET_SELECTED_SUBFORM: {
      const { id } = payload;
      const selectedSubform = state
        .get("selectedSubforms", fromJS([]))
        .find(form => form.get("id") === id);

      if (!selectedSubform) {
        const subform = state.getIn(
          ["formSections", id.toString()],
          fromJS({})
        );

        const fields = subform
          .get("fields")
          .map(fieldId => state.getIn(["fields", fieldId.toString()]));

        const selectedSubforms = state.get("selectedSubforms", fromJS([]));

        return state
          .set("selectedFieldSubform", subform.set("fields", fromJS(fields)))
          .set(
            "selectedSubforms",
            selectedSubforms.push(subform.set("fields", fromJS(fields)))
          );
      }

      return state.set("selectedFieldSubform", selectedSubform);
    }
    case actions.UPDATE_SELECTED_FIELD: {
      const fieldName = Object.keys(payload.data)[0];
      const selectedFieldIndex = state
        .get("selectedFields", fromJS([]))
        .findIndex(field => field.get("name") === fieldName);

      const selectedFieldPath = ["selectedFields", selectedFieldIndex];
      const selectedField = state.getIn(selectedFieldPath);

      return state.setIn(
        selectedFieldPath,
        selectedField.merge(
          fromJS(transformValues(payload.data[fieldName], true))
        )
      );
    }
    case actions.UPDATE_SELECTED_SUBFORM: {
      const subform = state.get("selectedFieldSubform", fromJS({}));
      const data = fromJS(payload.data);

      const fields = subform
        .get("fields")
        .map(field => fromJS({ [field.get("name")]: field }))
        .reduce((acc, field) => acc.merge(field), fromJS({}))
        .mergeDeep(data.get("fields"))
        .valueSeq();

      const subformIndex = state
        .get("selectedSubforms", fromJS([]))
        .findIndex(form => form.get("unique_id") === subform.get("unique_id"));

      return state.setIn(
        ["selectedSubforms", subformIndex],
        subform.merge(data).set("fields", fields)
      );
    }
    default:
      return state;
  }
};
