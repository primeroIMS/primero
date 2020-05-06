import isEmpty from "lodash/isEmpty";

import { TICK_FIELD } from "../form";
import { dataToJS } from "../../libs";
import { AGE_MAX } from "../../config";
import {
  AUDIO_FIELD,
  DOCUMENT_FIELD,
  PHOTO_FIELD,
  SEPERATOR,
  SUBFORM_SECTION
} from "../record-form/constants";

import { REPORTABLE_TYPES } from "./constants";

export const dependantFields = formSections => {
  const data = dataToJS(formSections);

  return data[0].fields.reduce((acc, field) => {
    if (["name.en", "description.en"].includes(field.name)) {
      return acc;
    }

    return {
      ...acc,
      [field.name]: field.type === TICK_FIELD ? false : []
    };
  }, {});
};

export const formatAgeRange = data =>
  data.join(", ").replace(/\../g, "-").replace(`-${AGE_MAX}`, "+");

export const getFormName = selectedRecordType => {
  return /(\w*reportable\w*)$/.test(selectedRecordType)
    ? REPORTABLE_TYPES[selectedRecordType]
    : "";
};

export const buildFields = (data, locale, isReportable) => {
  if (isReportable) {
    if (isEmpty(data)) {
      return [];
    }
    const formSection = data.name?.[locale];

    return data.fields.map(field => ({
      id: field.name,
      display_text: field.display_name[locale],
      formSection
    }));
  }

  const excludeFieldTypes = [
    AUDIO_FIELD,
    DOCUMENT_FIELD,
    PHOTO_FIELD,
    SEPERATOR,
    SUBFORM_SECTION
  ];

  return data
    .reduce((acc, form) => {
      // eslint-disable-next-line camelcase
      const { name, fields } = form;

      const filteredFields = fields
        .filter(
          field => !excludeFieldTypes.includes(field.type) && field.visible
        )
        .map(field => ({
          id: field.name,
          display_text: field.display_name[locale],
          formSection: name[locale]
        }));

      return [...acc, filteredFields];
    }, [])
    .flat();
};
