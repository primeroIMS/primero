import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import { format } from "date-fns";

import { TICK_FIELD } from "../form";
import { dataToJS } from "../../libs";
import { AGE_MAX, DATE_FORMAT } from "../../config";

import {
  ALLOWED_FIELD_TYPES,
  DESCRIPTION_FIELD,
  NAME_FIELD,
  REPORTABLE_TYPES
} from "./constants";

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
      formSection,
      type: field.type,
      option_strings_source: field.option_strings_source?.replace(
        /lookup /,
        ""
      ),
      option_strings_text: field.option_strings_text,
      tick_box_label: field.tick_box_label?.[locale]
    }));
  }

  return data
    .reduce((acc, form) => {
      // eslint-disable-next-line camelcase
      const { name, fields } = form;

      const filteredFields = fields
        .filter(
          field => ALLOWED_FIELD_TYPES.includes(field.type) && field.visible
        )
        .map(field => ({
          id: field.name,
          display_text: field.display_name[locale],
          formSection: name[locale],
          type: field.type,
          option_strings_source: field.option_strings_source?.replace(
            /lookup /,
            ""
          ),
          option_strings_text: field.option_strings_text,
          tick_box_label: field.tick_box_label?.[locale]
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

export const formattedFields = (allFields, modules, recordType, locale) => {
  const formsByModuleAndRecordType = dataToJS(allFields).filter(formSection =>
    Array.isArray(modules)
      ? formSection.module_ids.some(mod => modules.includes(mod))
      : formSection.module_ids.includes(modules)
  );
  const formName = getFormName(recordType);
  const recordTypesForms = formsByModuleAndRecordType.filter(
    formSection => formSection.parent_form === recordType
  );
  const reportableForm = formsByModuleAndRecordType
    .filter(formSection => formSection.unique_id === formName)
    ?.toJS()?.[0]?.fields?.[0]?.subform_section_id;

  return buildFields(
    formName ? reportableForm : recordTypesForms,
    locale,
    Boolean(formName)
  );
};

export const checkValue = filter => {
  const { value, constraint } = filter;

  if (typeof constraint === "boolean" && constraint) {
    return ["not_null"];
  }

  if (value instanceof Date) {
    return [format(value, DATE_FORMAT)];
  }

  if (/^\d+$/.test(value)) {
    console.log("NUMBER", value);

    return value;
  }

  return value;
};
