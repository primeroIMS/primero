import PropTypes from "prop-types";
import { useFieldArray, useWatch } from "react-hook-form";

import { useDialog } from "../../../../../action-dialog";
import { FORM_MODE_EDIT } from "../../../../../form";
import FiltersList from "../../../../../reports-form/components/filters-list";
import { CONSTRAINTS, NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";

function Component({ formMethods, conditionsFieldName = "display_conditions" }) {
  const { setDialog } = useDialog(CONDITIONS_DIALOG);
  const { remove } = useFieldArray({ control: formMethods.control, name: conditionsFieldName });
  const displayConditions = useWatch({ control: formMethods.control, name: conditionsFieldName, defaultValue: [] });

  const handleEdit = (index, filter) => {
    const [, value] = filter;

    setDialog({
      dialog: CONDITIONS_DIALOG,
      open: true,
      params: { mode: FORM_MODE_EDIT, index, initialValues: value.data }
    });
  };

  const handleDelete = index => remove(index);

  return (
    <FiltersList
      constraints={CONSTRAINTS}
      handleOpenModal={handleDelete}
      handleEdit={handleEdit}
      indexes={displayConditions.map((condition, index) => ({ index, data: condition }))}
    />
  );
}

Component.displayName = "ConditionList";

Component.propTypes = {
  conditionsFieldName: PropTypes.string,
  formMethods: PropTypes.object
};

export default Component;
