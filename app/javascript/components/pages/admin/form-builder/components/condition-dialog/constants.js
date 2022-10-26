export const NAME = "ConditionsDialog";
export const FORM_NAME = "ConditionsForm";
export const ATTRIBUTE_FIELD = "attribute";
export const CONSTRAINT_FIELD = "constraint";
export const VALUE_FIELD = "value";
export const DEFAULT_CONSTRAINTS = Object.freeze({
  lt: "report.filters.less_than",
  gt: "report.filters.greater_than",
  eq: "report.filters.equal_to"
});
export const DATE_CONSTRAINTS = Object.freeze({
  gt: "report.filters.before",
  lt: "report.filters.after"
});
export const CONSTRAINTS = Object.freeze({
  default: DEFAULT_CONSTRAINTS,
  date: DATE_CONSTRAINTS
});
