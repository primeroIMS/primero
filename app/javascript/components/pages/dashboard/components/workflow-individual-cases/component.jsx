import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import isEmpty from "lodash/isEmpty";
import clsx from "clsx";
import { push } from "connected-react-router";

import { getWorkflowIndividualCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import Permission from "../../../../application/permission";
import { selectModule } from "../../../../application";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox } from "../../../../dashboard";
import { MODULES, RECORD_TYPES, ROUTES } from "../../../../../config";
import { buildFilter } from "../../../../dashboard/utils";

import workflowTheme from "./theme";
import styles from "./styles.css";
import { NAME, CLOSED, REOPENED } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const workflowLabels = useSelector(
    state => selectModule(state, MODULES.CP)?.workflows?.[RECORD_TYPES.cases]?.[i18n.locale]
  );
  const casesWorkflow = useSelector(state => getWorkflowIndividualCases(state));

  const getData = workflowStep =>
    (casesWorkflow.size > 0 && casesWorkflow.toJS().indicators.workflow?.[workflowStep]) || {};

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_WORKFLOW}>
      <OptionsBox title={i18n.t("dashboard.workflow")} hasData={Boolean(casesWorkflow.size)} {...loadingIndicator}>
        <MuiThemeProvider theme={workflowTheme}>
          <Stepper>
            {workflowLabels
              ?.filter(step => ![CLOSED, REOPENED].includes(step.id))
              ?.map(step => {
                const workflowData = getData(step.id);
                const stepProps = { active: true, complete: true };
                const label = step.display_text || "";
                const handleClick = query => {
                  dispatch(
                    push({
                      pathname: ROUTES.cases,
                      search: buildFilter(query)
                    })
                  );
                };

                return (
                  <Step key={step.id} {...stepProps}>
                    <StepLabel>{label}</StepLabel>
                    <div className={css.stepCases} icon={null}>
                      <button
                        className={clsx(css.itemButton, { [css.itemButtonClick]: !isEmpty(workflowData) })}
                        type="button"
                        onClick={() => (!isEmpty(workflowData) ? handleClick(workflowData.query || {}) : null)}
                      >
                        <span>{workflowData.count || 0}</span> {i18n.t("cases.label")}
                      </button>
                    </div>
                  </Step>
                );
              })}
          </Stepper>
        </MuiThemeProvider>
      </OptionsBox>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
