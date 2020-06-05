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
    case actions.CREATE_SELECTED_FIELD: {
      const fieldName = Object.keys(payload.data)[0];

      return state.update("selectedFields", fields =>
        fields.push(fromJS(transformValues(payload.data[fieldName], true)))
      );
    }
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
      const { name, order } = payload;
      const selectedFields = state.get("selectedFields", fromJS([]));
      const reorderedField = selectedFields.find(
        field => field.get("name") === name
      );
      const currentOrder = reorderedField.get("order");

      const affectedRange = affectedOrderRange(currentOrder, order);

      if (affectedRange.length === 0) {
        return state;
      }

      const orderUpdater = buildOrderUpdater(currentOrder, order);

      return state.set(
        "selectedFields",
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
      return state.set("saving", true);
    case actions.SET_SELECTED_FIELD: {
      const selectedField = state
        .get("selectedFields", fromJS([]))
        .find(field => field.get("name") === payload.name);

      return state.set("selectedField", selectedField);
    }
    case actions.SET_NEW_FIELD: {
      return state.set("selectedField", fromJS(payload));
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
    default:
      return state;
  }
};
