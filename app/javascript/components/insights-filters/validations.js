// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";
import { object, string } from "yup";

import {
  CUSTOM,
  DATE_RANGE,
  DATE_RANGE_DISPLAY_NAME,
  DATE_RANGE_FROM_DISPLAY_NAME,
  DATE_RANGE_TO_DISPLAY_NAME,
  FILTER_BY_DATE_DISPLAY_NAME,
  GROUPED_BY
} from "../insights/constants";

const customDateValidation = (i18n, from = false) =>
  string().when(DATE_RANGE, {
    is: CUSTOM,
    then: string().required(
      i18n.t("forms.required_field", {
        field: i18n.t(from ? DATE_RANGE_FROM_DISPLAY_NAME : DATE_RANGE_TO_DISPLAY_NAME)
      })
    )
  });

export default (i18n, filters) => {
  const validations = {
    date: string()
      .nullable()
      .ensure()
      .when(DATE_RANGE, {
        is: value => !isEmpty(value),
        then: string()
          .nullable()
          .required(i18n.t("forms.required_field", { field: i18n.t(FILTER_BY_DATE_DISPLAY_NAME) }))
      }),
    date_range: string()
      .nullable()
      .when(GROUPED_BY, {
        is: value => !isEmpty(value),
        then: string()
          .nullable()
          .required(i18n.t("forms.required_field", { field: i18n.t(DATE_RANGE_DISPLAY_NAME) }))
      }),
    from: customDateValidation(i18n, true),
    to: customDateValidation(i18n)
  };

  return object().shape(pick(validations, filters));
};
