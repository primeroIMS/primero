/* eslint-disable import/prefer-default-export */
import isNil from "lodash/isNil";

export const getComparisons = ({ fields, comparedFields, includeEmpty }) =>
  fields
    .map(field => {
      const comparedField = comparedFields.find(comparison => comparison.get("field_name") === field.name);

      if (!comparedField?.size) {
        return null;
      }

      if (!includeEmpty && (isNil(comparedField.get("trace_value")) || isNil(comparedField.get("case_value")))) {
        return null;
      }

      return {
        field,
        traceValue: comparedField.get("trace_value"),
        caseValue: comparedField.get("case_value"),
        match: comparedField.get("match")
      };
    })
    .filter(comparison => comparison?.field);
