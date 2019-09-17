import React from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import styles from "./styles.css";

const WorkFlowIndicator = ({ locale }) => {
  const css = makeStyles(styles)();

  // TODO: activeStep will come from record and steps will come from systemsettings
  const steps = [
    {
      id: "new",
      display_text: {
        en: "New"
      }
    },
    {
      id: "assessment",
      display_text: {
        en: "Assessment"
      }
    },
    {
      id: "case_plan",
      display_text: {
        en: "Case Plan"
      }
    },
    {
      id: "direct",
      display_text: {
        en: "Direct Response"
      }
    },
    {
      id: "referred",
      display_text: {
        en: "Referred Response"
      }
    },
    {
      id: "service",
      display_text: {
        en: "Service Implemented"
      }
    },
    {
      id: "closed",
      display_text: {
        en: "Closed"
      }
    }
  ];
  const activeStep = steps.findIndex(s => s.id === "referred");

  return (
    <Stepper
      classes={{ root: css.stepper }}
      activeStep={activeStep >= 0 ? activeStep : 0}
    >
      {steps.map((s, index) => {
        const stepProps = {};
        const label = s.display_text[locale] || "";

        stepProps.complete = index < activeStep;

        return (
          <Step key={s.id} {...stepProps}>
            <StepLabel
              classes={{ label: css.stepLabel, active: css.styleLabelActive }}
            >
              {label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

WorkFlowIndicator.propTypes = {
  locale: PropTypes.string.isRequired
};

export default WorkFlowIndicator;
