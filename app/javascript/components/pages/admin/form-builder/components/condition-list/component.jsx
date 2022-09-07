import PropTypes from "prop-types";
import { useFieldArray, useWatch } from "react-hook-form";

import generateKey from "../../../../../charts/table-values/utils";
import ConditionItem from "../condition-item";

function Component({ formMethods, conditionsFieldName = "display_conditions" }) {
  const { remove } = useFieldArray({ control: formMethods.control, name: conditionsFieldName });
  const displayConditions = useWatch({ control: formMethods.control, name: conditionsFieldName, defaultValue: [] });

  return displayConditions.map((condition, index) => (
    <ConditionItem
      key={generateKey(condition.field_name)}
      conditionsFieldName={conditionsFieldName}
      index={index}
      condition={condition}
      remove={remove}
    />
  ));
}

Component.displayName = "ConditionList";

Component.propTypes = {
  conditionsFieldName: PropTypes.string,
  formMethods: PropTypes.object
};

export default Component;
