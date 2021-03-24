import { fromJS, List } from "immutable";
import range from "lodash/range";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

import { RECORD_PATH, SAVE_METHODS } from "../../../../config";
import { invalidCharRegexp } from "../../../../libs";
import { get } from "../../../form/utils";

export const convertToFieldsObject = fields =>
  fields.map(field => ({ [field.name]: field })).reduce((acc, value) => ({ ...acc, ...value }), {});

export const convertToFieldsArray = fields => Object.keys(fields).map(key => ({ name: key, ...fields[key] }));

export const getOrderDirection = (currentOrder, newOrder) => newOrder - currentOrder;

export const affectedOrderRange = (currentOrder, newOrder, step = 1) => {
  const orderDirection = getOrderDirection(currentOrder, newOrder);

  if (orderDirection > 0) {
    return range(currentOrder, newOrder + step, step);
  }

  if (orderDirection === 0) {
    return [];
  }

  return range(newOrder, currentOrder + step, step);
};

export const buildOrderUpdater = (currentOrder, newOrder) => {
  if (getOrderDirection(currentOrder, newOrder) > 0) {
    return field => field.set("order", field.get("order") - 1);
  }

  return field => field.set("order", field.get("order") + 1);
};

export const getFormRequestPath = (id, saveMethod) =>
  saveMethod === SAVE_METHODS.update ? `${RECORD_PATH.forms}/${id}` : RECORD_PATH.forms;

export const getFieldsTranslations = fields =>
  Object.keys(fields)
    .map(key => ({ [key]: { display_name: { en: fields[key].display_name?.en } } }))
    .reduce((acc, elem) => ({ ...acc, ...elem }), {});

export const mergeTranslations = data => {
  const translations = { ...data.translations };
  const source = { ...data };

  delete source.translations;
  delete source.selected_locale_id;

  return merge(source, translations);
};

export const buildFormGroupUniqueId = (moduleId, parentForm) => {
  if (!moduleId || !parentForm) {
    return "";
  }

  const primeroModule = Array.isArray(moduleId) ? moduleId[0] : moduleId;

  return `lookup-form-group-${primeroModule?.replace("primeromodule-", "")}-${parentForm}`;
};

export const getSubformFields = (state, subform) =>
  fromJS(
    subform
      ?.get("fields")
      ?.map(fieldId => state.getIn(["fields", fieldId.toString()]))
      ?.map(field =>
        field.set("on_collapsed_subform", subform.get("collapsed_field_names", fromJS([])).includes(field.get("name")))
      )
  );

export const getSubformErrorMessages = (errors, i18n) =>
  errors
    .map(errorParent =>
      errorParent.get("errors")?.map(error => {
        const message = error.get("message");
        const messageWithKeys = List.isList(message);

        if (!messageWithKeys) {
          return message;
        }

        return i18n.t(message.first(), {
          [error.get("detail")]: error.get("value")
        });
      })
    )
    .filter(error => Boolean(error))
    .flatten();

export const validateEnglishName = async value =>
  !(value.match(invalidCharRegexp)?.length || value.match(/^(\s+)$/)?.length);

export const getLookupFormGroup = (allFormGroupsLookups, moduleId, parentForm) => {
  if (!moduleId || !parentForm) {
    return {};
  }

  return allFormGroupsLookups.find(
    option => option.unique_id === buildFormGroupUniqueId(moduleId, parentForm.replace("_", "-"))
  );
};

export const formGroupsOptions = (allFormGroupsLookups, moduleId, parentForm) => {
  const formGroups = getLookupFormGroup(allFormGroupsLookups, moduleId, parentForm);

  if (!isEmpty(formGroups)) {
    return formGroups?.values?.reduce(
      (result, item) => [
        ...result,
        {
          id: item.id,
          display_text: get(item, "display_text", "")
        }
      ],
      []
    );
  }

  return [];
};
