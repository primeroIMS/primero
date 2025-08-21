// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";
import { batch } from "react-redux";

import { SEPARATOR } from "../../../form/constants";
import { FILTER_TYPES } from "../../../index-filters";
import { RECORD_TYPES_PLURAL } from "../../../../config";

import { FILTER_NAMES, FIRST_PAGE_RESULTS } from "./constants";

export const getFilters = (forms, i18n) => [
  {
    name: "change_logs.filters.form",
    field_name: FILTER_NAMES.form_unique_ids,
    type: FILTER_TYPES.MULTI_SELECT,
    option_strings_source: null,
    multiple: true,
    onChange: formMethods => {
      const { setValue } = formMethods;

      setValue(FILTER_NAMES.field_names, []);
    },
    options: forms.reduce(
      (acc, elem) => [...acc, { id: elem.get("unique_id"), display_text: elem.getIn(["name", i18n.locale]) }],
      []
    )
  },
  {
    name: "change_logs.filters.field",
    field_name: FILTER_NAMES.field_names,
    option_strings_source: null,
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: true,
    onChange: formMethods => {
      const { setValue } = formMethods;

      setValue(FILTER_NAMES.form_unique_ids, []);
    },
    options: forms
      .flatMap(form => form.get("fields", fromJS([])))
      .filter(field => field.type !== SEPARATOR)
      .groupBy(field => field.name)
      .valueSeq()
      .map(field => field.first())
      .reduce(
        (acc, elem) => [...acc, { id: elem.get("name"), display_text: elem.getIn(["display_name", i18n.locale]) }],
        []
      )
  }
];

export function onSubmitFn({ filters, dispatch, fetchFn, setFormFilters, recordId, recordType }) {
  batch(() => {
    dispatch(fetchFn(RECORD_TYPES_PLURAL[recordType], recordId, FIRST_PAGE_RESULTS, filters));
    dispatch(setFormFilters(filters));
  });
}
