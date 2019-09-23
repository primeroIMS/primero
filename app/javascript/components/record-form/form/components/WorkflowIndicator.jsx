import React from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { selectModule } from "components/application";
import { RECORD_TYPES } from "config";
import styles from "./styles.css";

const WorkflowIndicator = ({ locale, primeroModule, recordType, record }) => {
  const css = makeStyles(styles)();

  const selectedModuleWorkflow = useSelector(state =>
    selectModule(state, primeroModule)
  );

  const workflowSteps = selectedModuleWorkflow?.workflows?.[
    RECORD_TYPES[recordType]
  ]?.[locale]?.filter(
    w =>
      !(
        (record.get("case_status_reopened") && w.id === "new") ||
        (!record.get("case_status_reopened") && w.id === "reopened")
      )
  );

  const activeStep = workflowSteps.findIndex(
    s => s.id === record.get("workflow")
  );

  return (
    <Stepper classes={{ root: css.stepper }} activeStep={activeStep || 0}>
      {workflowSteps.map((s, index) => {
        const stepProps = {};
        const label = s.display_text || "";
        stepProps.complete = index < activeStep ? true : null;

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

WorkflowIndicator.propTypes = {
  locale: PropTypes.string.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired
};

export default WorkflowIndicator;
