import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import { useFieldArray, useWatch } from "react-hook-form";

import { useI18n } from "../../../../../i18n";
import { useDialog } from "../../../../../action-dialog";
import { FORM_MODE_EDIT } from "../../../../../form";
import FiltersList from "../../../../../reports-form/components/filters-list";
import { CONSTRAINTS, NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";

function Component({ field, formMethods }) {
  const i18n = useI18n();
  const { setDialog } = useDialog(CONDITIONS_DIALOG);
  const conditionsFieldName = field ? `${field.get("name")}.display_conditions_record` : "display_conditions";
  const { remove: removeCondition } = useFieldArray({ control: formMethods.control, name: conditionsFieldName });
  const { remove: removeConditionSubform } = useFieldArray({
    control: formMethods.control,
    name: `${field?.get("name")}.display_conditions_subform`
  });
  const displayConditions = useWatch({ control: formMethods.control, name: conditionsFieldName, defaultValue: [] });
  const displayConditionsSubform = useWatch({
    control: formMethods.control,
    name: `${field?.get("name")}.display_conditions_subform`,
    defaultValue: []
  });

  const handleEdit = (index, filter) => {
    const [, value] = filter;

    setDialog({
      dialog: CONDITIONS_DIALOG,
      open: true,
      params: { mode: FORM_MODE_EDIT, index, initialValues: value.data }
    });
  };

  const handleDelete = index => {
    removeCondition(index);
  };

  const handleDeleteSubform = index => {
    removeConditionSubform(index);
  };

  if (isEmpty(displayConditions) && isEmpty(displayConditionsSubform)) {
    return <p>{i18n.t("report.no_filters_added")}</p>;
  }

  return (
    <>
      <FiltersList
        showEmptyMessage={false}
        constraints={CONSTRAINTS}
        handleOpenModal={handleDelete}
        handleEdit={handleEdit}
        isConditionsList
        indexes={displayConditions.map((condition, index) => ({ index, data: condition }))}
      />
      <FiltersList
        showEmptyMessage={false}
        constraints={CONSTRAINTS}
        handleOpenModal={handleDeleteSubform}
        handleEdit={handleEdit}
        isConditionsList
        indexes={displayConditionsSubform.map((condition, index) => ({ index, data: condition }))}
      />
    </>
  );
}

Component.displayName = "ConditionList";

Component.propTypes = {
  field: PropTypes.object,
  formMethods: PropTypes.object
};

export default Component;
