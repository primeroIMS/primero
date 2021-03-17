import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import { format } from "date-fns";

import { displayNameHelper } from "../../libs";
import { AGE_MAX, DATE_FORMAT } from "../../config";

import { ALLOWED_FIELD_TYPES, REPORTABLE_TYPES } from "./constants";

export const formatAgeRange = data => data.join(", ").replace(/\../g, "-").replace(`-${AGE_MAX}`, "+");

export const getFormName = selectedRecordType => {
  return /(\w*reportable\w*)$/.test(selectedRecordType) ? REPORTABLE_TYPES[selectedRecordType] : "";
};

export const buildFields = (data, locale, isReportable) => {
  if (isReportable) {
    if (data.isEmpty()) {
      return [];
    }
    const formSection = displayNameHelper(data.get("name"), locale);

    return data.get("fields").reduce(
      (prev, current) => [
        ...prev,
        {
          id: current.get("name"),
          display_text: displayNameHelper(current.get("display_name"), locale),
          formSection,
          type: current.get("type"),
          option_strings_source: current.get("option_strings_source")?.replace(/lookup /, ""),
          option_strings_text: current.get("option_strings_text"),
          tick_box_label: current.getIn(["tick_box_label", locale])
        }
      ],
      []
    );
  }

  return data.reduce((acc, form) => {
    // eslint-disable-next-line camelcase
    const fields = form.get("fields");
    const name = form.get("name");

    const filteredFields = fields
      .filter(field => ALLOWED_FIELD_TYPES.includes(field.get("type")) && field.get("visible"))
      .reduce(
        (prev, current) => [
          ...prev,
          {
            id: current.get("name"),
            display_text: displayNameHelper(current.get("display_name"), locale),
            formSection: displayNameHelper(name, locale),
            type: current.get("type"),
            option_strings_source: current.get("option_strings_source")?.replace(/lookup /, ""),
            option_strings_text: current.get("option_strings_text"),
            tick_box_label: current.getIn(["tick_box_label", locale])
          }
        ],
        []
      );

    return [...acc, ...filteredFields];
  }, []);
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
        const rows = value.filter(({ position }) => position.type === "horizontal").map(({ name }) => name);
        const columns = value.filter(({ position }) => position.type === "vertical").map(({ name }) => name);

        return { ...acc, aggregate_by: rows, disaggregate_by: columns };
      }
      default:
        return { ...acc, [key]: value };
    }
  }, {});
};

export const formattedFields = (formSections, modules, recordType, locale) => {
  const formsByModuleAndRecordType = formSections.filter(formSection =>
    Array.isArray(modules)
      ? formSection.get("module_ids").some(mod => modules.includes(mod))
      : formSection.get("module_ids").includes(modules)
  );
  const formName = getFormName(recordType);
  const recordTypesForms = formsByModuleAndRecordType.filter(
    formSection => formSection.get("parent_form") === recordType
  );

  const reportableForm = formName
    ? formsByModuleAndRecordType
        .filter(formSection => formSection.get("unique_id") === formName)
        ?.getIn([0, "fields", 0, "subform_section_id"])
    : [];

  return buildFields(formName ? reportableForm : recordTypesForms, locale, Boolean(formName));
};

export const checkValue = filter => {
  const { value } = filter;

  if (value instanceof Date) {
    return format(value, DATE_FORMAT);
  }

  return value;
};

export const buildUserModules = userModules => {
  if (userModules.isEmpty()) {
    return [];
  }

  return userModules.reduce((current, prev) => {
    current.push({ id: prev.get("unique_id"), display_text: prev.get("name") });

    return current;
  }, []);
};
