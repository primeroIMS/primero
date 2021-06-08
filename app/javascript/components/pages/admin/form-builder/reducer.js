import { fromJS } from "immutable";

import { SUBFORM_SECTION } from "../../../form";

import actions from "./actions";
import { affectedOrderRange, buildOrderUpdater, getSubformFields } from "./utils";
import { transformValues } from "./components/field-dialog/utils";
import { NEW_FIELD } from "./constants";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.CLEAR_SELECTED_FORM:
      return state
        .set("selectedForm", fromJS({}))
        .set("errors", false)
        .set("serverErrors", fromJS([]))
        .set("selectedFields", fromJS([]));
    case actions.CREATE_SELECTED_FIELD: {
      const fieldName = Object.keys(payload.data)[0];
      const lastOrder = state
        .get("selectedFields", fromJS([]))
        .sortBy(field => field.get("order"))
        .last()
        ?.get("order");
      const order = lastOrder >= 0 ? lastOrder + 1 : 0;

      return state.update("selectedFields", fields =>
        fields.push(fromJS(transformValues({ ...payload.data[fieldName], order }, true)))
      );
    }
    case actions.CLEAR_SELECTED_FIELD:
      return state.delete("selectedField");
    case actions.CLEAR_SELECTED_SUBFORM_FIELD:
      return state.delete("selectedSubformField");
    case actions.CLEAR_SELECTED_SUBFORM:
      return state.delete("selectedSubform");
    case actions.CLEAR_SUBFORMS:
      return state.delete("subforms");
    case actions.FETCH_FORM_FAILURE:
      return state.set("errors", true).set("serverErrors", fromJS(payload.errors));
    case actions.FETCH_FORM_FINISHED:
      return state.set("loading", fromJS(payload));
    case actions.FETCH_FORM_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false).set("serverErrors", fromJS([]));
    case actions.FETCH_FORM_SUCCESS:
      return state
        .set("selectedForm", fromJS(payload.data))
        .set("selectedFields", fromJS(payload.data.fields))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.REORDER_FIELDS: {
      const { name, order, isSubform } = payload;
      const fieldsPath = isSubform ? ["selectedSubform", "fields"] : ["selectedFields"];
      const selectedFields = state.getIn(fieldsPath, fromJS([]));

      const reorderedField = selectedFields.find(field => field.get("name") === name);
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
      return state.set("errors", true).set("serverErrors", fromJS(payload.errors));
    case actions.SAVE_FORM_FINISHED:
      return state.set("saving", false);
    case actions.SAVE_FORM_STARTED:
      return state.set("saving", true);
    case actions.SAVE_SUBFORMS_STARTED:
      return state
        .set("saving", true)
        .set("errors", false)
        .set("serverErrors", fromJS([]))
        .set("updatedFormIds", fromJS([]));
    case actions.SAVE_SUBFORMS_SUCCESS: {
      // TODO: // rewrite this, non-performant code
      const subformsSaved = payload.filter(data => data.ok).map(data => data.json.data);
      const formsIds = subformsSaved.map(formSaved => formSaved.id);

      const errors = payload.filter(data => data.ok === false).map(data => data.json || data.error);

      if (errors.length) {
        return state.set("errors", true).set("serverErrors", fromJS(errors));
      }

      const newSubforms = subformsSaved.map(subformSaved => {
        if (Object.keys(subformSaved).length === 1) {
          const associatedSubform = state.get("subforms").find(subform => subformSaved.id === subform.get("id"));

          return associatedSubform;
        }

        return subformSaved;
      });

      const newSelectedFields = state.get("selectedFields").map(selectedField => {
        if (selectedField.get("type") !== SUBFORM_SECTION) {
          return selectedField;
        }

        const foundSubform = subformsSaved.find(
          subformSaved => subformSaved.unique_id === selectedField.get("subform_section_unique_id")
        );

        if (!foundSubform) {
          return selectedField;
        }

        return selectedField.set("subform_section_id", foundSubform.id);
      });

      return state
        .set("updatedFormIds", fromJS(formsIds))
        .set("subforms", fromJS(newSubforms))
        .set("selectedFields", newSelectedFields);
    }
    case actions.SAVE_SUBFORMS_FINISHED:
      return state.set("saving", false);
    case actions.SET_SELECTED_FIELD: {
      const selectedField = state.get("selectedFields", fromJS([])).find(field => field.get("name") === payload.name);

      return state.set("selectedField", selectedField);
    }
    case actions.SET_NEW_FIELD:
      return state.set("selectedField", fromJS(payload));
    case actions.SET_NEW_FIELD_SUBFORM:
      return state.set("selectedSubformField", fromJS(payload));
    case actions.SET_SELECTED_SUBFORM: {
      const { id, isSubformNew } = payload;
      const selectedSubform = state
        .get("subforms", fromJS([]))
        .find(form => (isSubformNew ? form.get("temp_id") === id : form.get("id") === id));

      if (!selectedSubform) {
        const subform = state.getIn(["formSections", id.toString()], fromJS({}));
        const fields = getSubformFields(state, subform);
        const selectedSubforms = state.get("subforms", fromJS([]));

        return state
          .set("selectedSubform", subform.set("fields", fields))
          .set("subforms", selectedSubforms.push(subform.set("fields", fields)));
      }

      const prevSelectedSubform = state.get("selectedSubform", fromJS({}));

      return state.set(
        "selectedSubform",
        prevSelectedSubform.unique_id && prevSelectedSubform.unique_id === selectedSubform.unique_id
          ? prevSelectedSubform
          : selectedSubform
      );
    }
    case actions.SET_SELECTED_SUBFORM_FIELD: {
      const selectedField = state
        .getIn(["selectedSubform", "fields"], fromJS([]))
        .find(field => field.get("name") === payload.name);

      return state.set("selectedSubformField", selectedField);
    }
    case actions.UPDATE_SELECTED_FIELD: {
      const fieldName = Object.keys(payload.data)[0];
      const fieldsPath = ["selectedSubform", "fields"];

      if (payload.subformId) {
        const fieldIndex = state.getIn(fieldsPath, fromJS([])).findIndex(field => field.get("name") === fieldName);

        if (fieldIndex < 0) {
          const lastOrder = state.getIn(fieldsPath)?.last()?.get("order") + 1;

          return state.updateIn(fieldsPath, data =>
            data.push(
              fromJS(
                transformValues(
                  {
                    ...Object.values(payload.data)[0],
                    order: lastOrder
                  },
                  true
                )
              )
            )
          );
        }

        const selectedSubformField = state.getIn(["selectedSubform", "fields", fieldIndex]);

        const mergedField = selectedSubformField.merge(fromJS(transformValues(payload.data[fieldName], true)));

        return state.setIn(["selectedSubform", "fields", fieldIndex], mergedField);
      }

      if (fieldName === NEW_FIELD) {
        return state;
      }

      const selectedFieldIndex = state
        .get("selectedFields", fromJS([]))
        .findIndex(field => field.get("name") === fieldName);

      const selectedFieldPath = ["selectedFields", selectedFieldIndex];
      const selectedField = state.getIn(selectedFieldPath);

      const mergedField = selectedField.merge(fromJS(payload.data[fieldName]));

      return state.setIn(selectedFieldPath, mergedField).set("selectedField", mergedField);
    }
    case actions.UPDATE_SELECTED_SUBFORM: {
      const subform = state.get("selectedSubform", fromJS({}));
      const data = fromJS(payload.data);

      const fields = subform.get("fields", fromJS([])).map(field => {
        const fieldName = field?.get("name");
        const mergedField = field.mergeDeep(data.getIn(["fields", fieldName], fromJS({})));

        if (mergedField.get("option_strings_text")) {
          const newOptionStringsText = fromJS(mergedField.get("option_strings_text")).toSet().toList();

          return mergedField.set("option_strings_text", newOptionStringsText);
        }

        return mergedField;
      });

      const existingSubforms = state.get("subforms", fromJS([]));
      const subformIndex = existingSubforms.findIndex(form => form.get("unique_id") === subform.get("unique_id"));

      const index = subformIndex < 0 ? existingSubforms.size : subformIndex;

      const collapsedFieldNames = fields
        .filter(field => field.get("on_collapsed_subform") === true)
        .map(field => field.get("name"))
        .toSet()
        .toList();

      const subformSectionConfiguration = state.getIn(["selectedField", "subform_section_configuration"], fromJS({}));

      const mergedSubform = subform
        .mergeDeep(data)
        .set("fields", fields)
        .set("collapsed_field_names", collapsedFieldNames)
        .set("subform_section_configuration", subformSectionConfiguration);

      if (subformIndex < 0) {
        return state.set("selectedSubform", mergedSubform);
      }

      return state.setIn(["subforms", index], mergedSubform).set("selectedSubform", mergedSubform);
    }
    case actions.UPDATE_FIELD_TRANSLATIONS: {
      const selectedFields = state.get("selectedFields");
      const fields = Object.keys(payload);

      const indexes = fields.map(field => [field, selectedFields.findIndex(value => value.get("name") === field)]);

      return selectedFields
        .filter(field => field.get("type") === SUBFORM_SECTION && fields.includes(field.get("name")))
        .reduce((acc, elem) => {
          const subformId = elem.get("subform_section_id");
          const subformIndex = acc.get("subforms", fromJS([])).findIndex(subform => subformId === subform.get("id"));
          const subformData = fromJS({ name: payload[elem.get("name")].display_name });

          if (subformIndex < 0) {
            const subformSection = acc.getIn(["formSections", subformId.toString()]);

            const subformFields = getSubformFields(acc, subformSection);

            return acc.set(
              "subforms",
              acc.get("subforms", fromJS([])).push(subformSection.mergeDeep(subformData).set("fields", subformFields))
            );
          }

          return acc.setIn(["subforms", subformIndex], acc.getIn(["subforms", subformIndex]).mergeDeep(subformData));
        }, state)
        .set(
          "selectedFields",
          fromJS(
            indexes.map(([field, index]) => selectedFields.get(index, fromJS({})).mergeDeep(fromJS(payload[field])))
          )
        );
    }
    case actions.SET_NEW_SUBFORM: {
      const subforms = state.get("subforms");

      const mergedSubform = fromJS(payload)
        .set("fields", state.getIn(["selectedSubform", "fields"], fromJS([])))
        .set("collapsed_field_names", state.getIn(["selectedSubform", "collapsed_field_names"], fromJS([])));

      if (!subforms) {
        return state.set("subforms", fromJS([mergedSubform]));
      }

      return state.update("subforms", data => data.push(fromJS(mergedSubform)));
    }
    case actions.SET_TEMPORARY_SUBFORM: {
      return state.set(
        "selectedSubform",
        fromJS(payload).set("fields", fromJS([])).set("collapsed_field_names", fromJS([]))
      );
    }
    case actions.MERGE_SUBFORM_DATA: {
      const subform = state.get("selectedSubform", fromJS({}));
      const selectedField = state.get("selectedField", fromJS({}));

      const mergedSubform = subform
        .mergeDeep(fromJS(payload.subform))
        .set("fields", subform.get("fields"))
        .set("collapsed_field_names", subform.get("collapsed_field_names"));

      const mergedSelectedField = selectedField.mergeDeep(
        fromJS({ ...payload.subformField, disabled: !payload.subformField.disabled })
      );

      return state.set("selectedSubform", mergedSubform).set("selectedField", mergedSelectedField);
    }
    case actions.SELECT_EXISTING_FIELDS: {
      const { addedFields, removedFields } = payload;

      const fields = state.get("fields", fromJS({})).valueSeq().toList();

      const order =
        (state
          .get("selectedFields")
          .map(field => field.get("order"))
          .sort()
          .last() || 0) + 1;

      const newFields = fields
        .filter(field =>
          addedFields.some(addedField => field.get("id") === addedField.id && field.get("name") === addedField.name)
        )
        .map((field, index) => field.set("order", order + index));

      const fieldsToRemove = fields.filter(field =>
        removedFields.some(
          removedField => field.get("id") === removedField.id && field.get("name") === removedField.name
        )
      );

      const selectedFields = state
        .get("selectedFields")
        .filter(
          field =>
            !fieldsToRemove.some(
              removed => removed.get("id") === field.get("id") && field.get("name") === removed.get("name")
            )
        )
        .concat(newFields);

      return state
        .set("selectedFields", selectedFields)
        .set("copiedFields", newFields)
        .set("removedFields", fieldsToRemove);
    }
    default:
      return state;
  }
};
