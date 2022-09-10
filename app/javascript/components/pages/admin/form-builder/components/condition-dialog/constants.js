export const NAME = "ConditionsDialog";
export const FORM_NAME = "ConditionsForm";
export const ATTRIBUTE_FIELD = "attribute";
export const CONSTRAINT_FIELD = "constraint";
export const VALUE_FIELD = "value";
export const CONSTRAINTS = Object.freeze({
  lt: "report.filters.less_than",
  gt: "report.filters.greater_than",
  eq: "report.filters.equal_to",
  not_null: "report.filters.not_blank"
});
export const DATE_CONSTRAINTS = Object.freeze({
  gt: "report.filters.before",
  lt: "report.filters.after"
});
