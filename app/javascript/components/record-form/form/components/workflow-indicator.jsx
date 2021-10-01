/* eslint-disable camelcase */
import { Stepper, Step, StepLabel, useMediaQuery, Badge } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import { selectModule } from "../../../application";
import { RECORD_TYPES } from "../../../../config";
import { displayNameHelper, useMemoizedSelector } from "../../../../libs";

import styles from "./styles.css";
import { WORKFLOW_INDICATOR_NAME, CLOSED } from "./constants";

const useStyles = makeStyles(styles);

const WorkflowIndicator = ({ locale, primeroModule, recordType, record }) => {
  const css = useStyles();
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const selectedModuleWorkflow = useMemoizedSelector(state => selectModule(state, primeroModule));

  const workflowSteps = selectedModuleWorkflow?.workflows?.[RECORD_TYPES[recordType]]?.filter(
    w =>
      !(
        (record.get("case_status_reopened") && w.id === "new") ||
        (!record.get("case_status_reopened") && w.id === "reopened")
      )
  );

  const activeStep = workflowSteps?.findIndex(
    workflowStep =>
      workflowStep.id === (record.get("status") === CLOSED ? record.get("status") : record.get("workflow"))
  );

  if (mobileDisplay && workflowSteps) {
    return (
      <>
        <div className={css.mobileStepper}>
          <Badge color="primary" badgeContent={(activeStep + 1)?.toString()} />
          <div>{displayNameHelper(workflowSteps?.[activeStep]?.display_text, locale)}</div>
        </div>
      </>
    );
  }

  return (
    <Stepper classes={{ root: css.stepper }} activeStep={activeStep || 0}>
      {workflowSteps?.map((s, index) => {
        const label = displayNameHelper(s.display_text, locale) || "";

        return (
          <Step key={s.id} complete={Boolean(index < activeStep)}>
            <StepLabel classes={{ label: css.stepLabel, active: css.styleLabelActive }}>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

WorkflowIndicator.displayName = WORKFLOW_INDICATOR_NAME;

WorkflowIndicator.propTypes = {
  locale: PropTypes.string.isRequired,
  primeroModule: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired
};

export default WorkflowIndicator;
