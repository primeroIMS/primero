/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../../../../i18n";

import { NAME } from "./constants";
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

  const renderSortBy = () =>
    subformSortBy ? (
      <Button className={css.clearButton} onClick={onClearSortBy}>
        <CloseIcon />
        {i18n.t("fields.clear_sort_by")}
      </Button>
    ) : null;

  const renderGroupBy = () =>
    subformGroupBy ? (
      <Button className={css.clearButton} onClick={onClearGroupBy}>
        <CloseIcon />
        {i18n.t("fields.clear_group_by")}
      </Button>
    ) : null;

  return (
    <div className={css.fieldRow}>
      <div className={css.fieldColumn}>{renderSortBy()}</div>
      <div className={css.fieldColumn}>{renderGroupBy()}</div>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  subformField: PropTypes.object
};

export default Component;
