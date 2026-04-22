import isEmpty from "lodash/isEmpty";
import differenceWith from "lodash/differenceWith";

import { getShortIdFromUniqueId } from "../../../records/utils";
import { NEW } from "../subforms/subform-add-entry/constants";

import buildCollapsedFields from "./build-collapsed-fields";

export default ({ fieldName, formikValues, parentValues, collapsedFields, fields, i18n }) => {
  if (isEmpty(formikValues) && isEmpty(parentValues)) {
    return [];
  }
  const parentFieldValues = parentValues[fieldName] || [];
  const currentFieldValues = formikValues[fieldName] || [];

  const valuesToEvaluate = differenceWith(
    parentFieldValues,
    currentFieldValues,
    (currFrom, currTo) => currFrom.unique_id === currTo.unique_id
  );

  return valuesToEvaluate.reduce(
    (acc, curr) => {
      const shortUniqueID = getShortIdFromUniqueId(curr.unique_id);

      const collapsedFieldsValues = buildCollapsedFields({
        collapsedFieldNames: collapsedFields,
        values: curr,
        fields,
        i18n
      });
      const valueToReder = isEmpty(collapsedFieldsValues) ? (
        shortUniqueID
      ) : (
        <>
          <span>{shortUniqueID}</span>
          {collapsedFieldsValues}
        </>
      );

      return [...acc, { id: curr.unique_id, value: valueToReder }];
    },
    [{ id: NEW, value: i18n.t("buttons.new") }]
  );
};
