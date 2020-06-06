import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";

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

import { DESCRIPTION_FIELD, NAME_FIELD, REPORTABLE_TYPES } from "./constants";

export const dependantFields = formSections => {
  const data = dataToJS(formSections);

  return data[0].fields.reduce((acc, field) => {
    if ([NAME_FIELD, DESCRIPTION_FIELD].includes(field.name)) {
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

export const buildReportFields = (data, type) => {
  if (isEmpty(data)) {
    return [];
  }

  const result = [...(isString(data) ? data.split(",") : data)];

  return result.reduce((acc, name, order) => {
    return [
      ...acc,
      {
        name,
        position: {
          type,
          order
        }
      }
    ];
  }, []);
};

export const formatReport = report => {
  return Object.entries(report).reduce((acc, curr) => {
    const [key, value] = curr;

    switch (key) {
      case "description":
        return { ...acc, [key]: value === null ? "" : value };
      case "fields": {
        const rows = value
          .filter(({ position }) => position.type === "horizontal")
          .map(({ name }) => name);
        const columns = value
          .filter(({ position }) => position.type === "vertical")
          .map(({ name }) => name);

        return { ...acc, aggregate_by: rows, disaggregate_by: columns };
      }
      default:
        return { ...acc, [key]: value };
    }
  }, {});
};
