// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { object, string } from "yup";

import { LINK_FIELD } from "../form";

export const buildValidation = (fields, searchByRequiredMessage) => {
  const selectableFields = fields[0].option_strings_text.map(option => [option.id, option.display_text]);

  return object().shape({
    search_by: string().required(searchByRequiredMessage).nullable(),
    ...selectableFields.reduce((prev, current) => {
      return {
        ...prev,
        [current[0]]: string().label(current[1]).when("search_by", { is: current[0], then: string().required() })
      };
    }, {})
  });
};

export const buildSearchParams = (params, phoneticFieldNames) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    if (phoneticFieldNames.includes(key)) {
      return { ...acc, query: value, phonetic: true };
    }

    return { ...acc, [key]: value };
  }, {});

export const setupLinkField = ({ formSections, recordType, linkFieldDisplay, id }) => {
  return formSections.map(formSection =>
    formSection.set(
      "fields",
      formSection.fields.map(field => {
        if (field.name === linkFieldDisplay) {
          return field.set("type", LINK_FIELD).set("href", `/${recordType}/${id}`);
        }

        return field;
      })
    )
  );
};
