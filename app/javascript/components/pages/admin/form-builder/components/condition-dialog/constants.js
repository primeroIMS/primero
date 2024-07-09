// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { TEXT_FIELD, TEXT_AREA, SEPARATOR, SUBFORM_SECTION, TALLY_FIELD } from "../../../../../form";

export const NAME = "ConditionsDialog";
export const FORM_NAME = "ConditionsForm";
export const ATTRIBUTE_FIELD = "attribute";
export const CONSTRAINT_FIELD = "constraint";
export const VALUE_FIELD = "value";
export const TYPE_FIELD = "type";
export const DEFAULT_CONSTRAINTS = Object.freeze({
  lt: "report.filters.less_than",
  gt: "report.filters.greater_than",
  eq: "report.filters.equal_to"
});
export const DATE_CONSTRAINTS = Object.freeze({
  gt: "report.filters.after",
  lt: "report.filters.before"
});
export const CONSTRAINTS = Object.freeze({
  default: DEFAULT_CONSTRAINTS,
  date: DATE_CONSTRAINTS
});

export const EXCLUDED_FIELD_TYPES = Object.freeze([SEPARATOR, SUBFORM_SECTION, TALLY_FIELD, TEXT_FIELD, TEXT_AREA]);
