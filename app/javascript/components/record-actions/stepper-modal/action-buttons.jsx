import React from "react";
import PropTypes from "prop-types";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import { useI18n } from "../../i18n";

import { ACTION_BUTTONS } from "./constants";
import styles from "./styles.css";

const ActionButtons = ({
  activeStep,
  handleBack,
  handleNext,
  handleSaveAndAction,
  totalSteps
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const previousButtonClass = activeStep === 0 ? css.hide : null;

  const previosButton = (
    <Button
      className={clsx(css.previousButton, previousButtonClass)}
      onClick={handleBack}
      variant="outlined"
      color="primary"
    >
      {i18n.t("actions.previous")}
    </Button>
  );

  const nextButton =
    activeStep === totalSteps ? (
      <>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {i18n.t("buttons.save")}
        </Button>
        {handleSaveAndAction ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveAndAction}
            className={css.successButton}
          >
            {i18n.t("buttons.save_and_add_service_provision")}
          </Button>
        ) : null}
      </>
    ) : (
      <Button variant="contained" color="primary" onClick={handleNext}>
        {i18n.t("actions.next")}
      </Button>
    );

  const justifyButtons =
    activeStep === totalSteps ? "flex-start" : "space-between";

  return (
    <Grid
      container
      direction="row"
      justify={justifyButtons}
      alignItems="flex-end"
      className={css.actionButtons}
    >
      {previosButton}
      {nextButton}
    </Grid>
  );
};

ActionButtons.propTypes = {
  activeStep: PropTypes.number,
  handleBack: PropTypes.func,
  handleNext: PropTypes.func,
  handleSaveAndAction: PropTypes.func,
  totalSteps: PropTypes.number
};

ActionButtons.displayName = ACTION_BUTTONS;

export default ActionButtons;
