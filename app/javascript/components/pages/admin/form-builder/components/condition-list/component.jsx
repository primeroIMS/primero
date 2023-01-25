import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import { useFieldArray } from "react-hook-form";
import AddIcon from "@material-ui/icons/Add";

import { useI18n } from "../../../../../i18n";
import { useDialog } from "../../../../../action-dialog";
import { FORM_MODE_EDIT } from "../../../../../form";
import FiltersList from "../../../../../reports-form/components/filters-list";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";
import { CONSTRAINTS, NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";

function Component({ addButtonProps, fieldName, formMethods, hasNestedConditions, isNested, title }) {
  const i18n = useI18n();
  const { setDialog } = useDialog(CONDITIONS_DIALOG);
  const { onClick, text, disabled } = addButtonProps;
  const { remove: removeCondition } = useFieldArray({ control: formMethods.control, name: fieldName });
  const displayConditions = formMethods.getValues(fieldName) || [];

  const handleEdit = (index, filter) => {
    const [, value] = filter;

    setDialog({
      dialog: CONDITIONS_DIALOG,
      open: true,
      params: { mode: FORM_MODE_EDIT, index, initialValues: value.data, isNested }
    });
  };

  const handleDelete = index => {
    removeCondition(index);
  };

  const indexes = displayConditions.map((condition, index) => ({ index, data: condition }));

  return (
    <>
      <h1>{title || i18n.t("forms.skip_logic.title")}</h1>
      {isEmpty(displayConditions) ? (
        <p>{i18n.t("forms.conditions.empty")}</p>
      ) : (
        <FiltersList
          showEmptyMessage={false}
          constraints={CONSTRAINTS}
          handleOpenModal={handleDelete}
          handleEdit={handleEdit}
          hasNestedConditions={hasNestedConditions}
          isConditionsList
          indexes={indexes}
        />
      )}
      <ActionButton
        id={`add-${fieldName}`}
        icon={<AddIcon />}
        text={text}
        type={ACTION_BUTTON_TYPES.default}
        noTranslate
        disabled={disabled}
        rest={{ onClick }}
      />
    </>
  );
}

Component.displayName = "ConditionList";

Component.propTypes = {
  addButtonProps: PropTypes.shape({
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    text: PropTypes.string
  }),
  fieldName: PropTypes.string,
  formMethods: PropTypes.object,
  hasNestedConditions: PropTypes.bool,
  isNested: PropTypes.bool,
  title: PropTypes.string
};

export default Component;
