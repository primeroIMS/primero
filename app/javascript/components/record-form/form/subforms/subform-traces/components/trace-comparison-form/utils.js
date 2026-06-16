/* eslint-disable import/prefer-default-export */
import isNil from "lodash/isNil";

export const getComparisons = ({ fields = [], comparedFields, includeEmpty }) => {
  return fields
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
};

export const toAttachmentArray = attachments =>
  attachments.reduce(
    (acc, audio) =>
      acc.concat({
        id: audio.get("id"),
        attachment_url: audio.get("attachment_url"),
        file_name: audio.get("file_name")
      }),
    []
  );
