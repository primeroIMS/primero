import { useCallback } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

import { useDialog } from "../../../../../action-dialog";
import { FORM_MODE_EDIT } from "../../../../../form";
import { displayNameHelper, useMemoizedSelector, useThemeHelper } from "../../../../../../libs";
import { getFieldByName } from "../../../../../record-form/selectors";
import { useI18n } from "../../../../../i18n";
import { NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";

import css from "./styles.css";

function Component({ condition, remove, index }) {
  const i18n = useI18n();
  const { isRTL } = useThemeHelper();
  const renderIcon = isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />;
  const { setDialog } = useDialog(CONDITIONS_DIALOG);
  const field = useMemoizedSelector(state => getFieldByName(state, condition.attribute));

  const onShow = useCallback(() => {
    setDialog({
      dialog: CONDITIONS_DIALOG,
      open: true,
      params: { mode: FORM_MODE_EDIT, index, initialValues: condition }
    });
  }, [index]);

  const onDelete = useCallback(() => {
    remove(index);
  }, [index]);

  return (
    <div className={css.conditionItem}>
      <div className={css.conditionFieldName}>{displayNameHelper(field?.display_name, i18n.locale)}</div>
      <div className={css.conditionActions}>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={onShow}>{renderIcon}</IconButton>
      </div>
    </div>
  );
}

Component.displayName = "ConditionItem";

Component.propTypes = {
  condition: PropTypes.shape({
    attribute: PropTypes.string,
    constraint: PropTypes.string,
    value: PropTypes.any
  }),
  index: PropTypes.number,
  remove: PropTypes.func
};

export default Component;
