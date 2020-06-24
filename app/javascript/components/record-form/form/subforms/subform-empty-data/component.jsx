import React from "react";
import PropTypes from "prop-types";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import ErrorIcon from "@material-ui/icons/Error";

import styles from "../styles.css";

import { NAME } from "./constants";

const Component = ({ handleClick, i18n, mode, subformName }) => {
  const css = makeStyles(styles)();

  const { isShow } = mode;
  const renderAddButton = !isShow && (
    <Fab
      className={css.actionButtonSubform}
      variant="extended"
      onClick={handleClick}
    >
      <AddIcon />
      {i18n.t("fields.add")}
    </Fab>
  );

  return (
    <div className={css.emptySubformContainer}>
      <ErrorIcon />
      <span>
        <strong>
          {i18n.t("forms.subform_not_found", { subform_name: subformName })}
        </strong>
        {i18n.t("forms.subform_need_to_be_added")}
      </span>
      {renderAddButton}
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  handleClick: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  subformName: PropTypes.string
};

export default Component;
