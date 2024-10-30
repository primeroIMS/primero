// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable camelcase */
import { Stepper, Step, StepLabel, useMediaQuery, Badge } from "@mui/material";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { getWorkflowLabels } from "../../../application";
import { RECORD_TYPES } from "../../../../config";
import { displayNameHelper, useMemoizedSelector } from "../../../../libs";

import css from "./styles.css";
import { WORKFLOW_INDICATOR_NAME, CLOSED } from "./constants";

function WorkflowIndicator({ locale, primeroModule, recordType, record }) {
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const workflowLabels = useMemoizedSelector(state =>
    getWorkflowLabels(state, primeroModule, RECORD_TYPES[recordType])
  );

  const workflowSteps = workflowLabels.filter(
    workflowLabel =>
      !(
        (record.get("case_status_reopened") && workflowLabel.id === "new") ||
        (!record.get("case_status_reopened") && workflowLabel.id === "reopened")
      )
  );

  const activeStep = workflowSteps.findIndex(
    workflowStep =>
      workflowStep.id === (record.get("status") === CLOSED ? record.get("status") : record.get("workflow"))
  );

  if (mobileDisplay && !isEmpty(workflowSteps)) {
    return (
      <>
        <div className={css.mobileStepper}>
          <Badge data-testid="badge" color="primary" badgeContent={(activeStep + 1)?.toString()} />
          <div>{displayNameHelper(workflowSteps?.[activeStep]?.display_text, locale)}</div>
        </div>
      </>
    );
  }

  return (
    <Stepper data-testid="stepper" classes={{ root: css.stepper }} activeStep={activeStep || 0}>
      {workflowSteps?.map((s, index) => {
        const label = displayNameHelper(s.display_text, locale) || "";

        return (
          <Step data-testid="step" key={s.id} complete={Boolean(index < activeStep)}>
            <StepLabel classes={{ label: css.stepLabel, active: css.styleLabelActive }}>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}

WorkflowIndicator.displayName = WORKFLOW_INDICATOR_NAME;

WorkflowIndicator.propTypes = {
  locale: PropTypes.string.isRequired,
  primeroModule: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired
};

export default WorkflowIndicator;
