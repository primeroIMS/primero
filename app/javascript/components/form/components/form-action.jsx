import React from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@material-ui/core";

import { useThemeHelper } from "../../../libs";
import ButtonText from "../../button-text";

import styles from "./styles.css";

const FormAction = ({
  actionHandler,
  cancel,
  savingRecord,
  startIcon,
  text
}) => {
  const { css } = useThemeHelper(styles);

  const renderCircularProgress = savingRecord && !cancel && (
    <CircularProgress size={24} value={25} className={css.loadingMargin} />
  );

  return (
    <Button
      className={cancel ? css.actionButtonCancel : css.actionButton}
      onClick={actionHandler}
      disabled={savingRecord}
      startIcon={startIcon}
      size="small"
    >
      {renderCircularProgress}
      <ButtonText text={text} />
    </Button>
  );
};

FormAction.displayName = "FormAction";

FormAction.defaultProps = {
  savingRecord: false
};

FormAction.propTypes = {
  actionHandler: PropTypes.func.isRequired,
  cancel: PropTypes.bool,
  savingRecord: PropTypes.bool,
  startIcon: PropTypes.object,
  text: PropTypes.string.isRequired
};

export default FormAction;
