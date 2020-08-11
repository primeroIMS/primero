/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

import { useI18n } from "../../../../../i18n";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import ActionButton from "../../../../../action-button";

import { NAME, GROUP_BY, SORT_BY } from "./constants";
import styles from "./styles.css";

const Component = ({ subformField }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { watch, setValue } = useFormContext();
  const fieldName = subformField.get("name");
  const subformGroupBy = watch(`${fieldName}.subform_group_by`);
  const subformSortBy = watch(`${fieldName}.subform_sort_by`);

  const onClearSortBy = () => {
    setValue(`${fieldName}.subform_sort_by`, "");
  };

  const onClearGroupBy = () => {
    setValue(`${fieldName}.subform_group_by`, "");
  };

  const renderClearButton = (fieldBy, onClick) =>
    ((fieldBy === SORT_BY && subformSortBy) || (fieldBy === GROUP_BY && subformGroupBy)) && (
      <ActionButton
        icon={<CloseIcon />}
        text={i18n.t(`fields.clear_${fieldBy}`)}
        type={ACTION_BUTTON_TYPES.default}
        isCancel
        rest={{
          onClick
        }}
      />
    );

  return (
    <div className={css.fieldRow}>
      <div className={css.fieldColumn}>{renderClearButton(SORT_BY, onClearSortBy)}</div>
      <div className={css.fieldColumn}>{renderClearButton(GROUP_BY, onClearGroupBy)}</div>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  subformField: PropTypes.object
};

export default Component;
