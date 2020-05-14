import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import {
  getCasesByTaskOverdueAssessment,
  getCasesByTaskOverdueCasePlan,
  getCasesByTaskOverdueServices,
  getCasesByTaskOverdueFollowups
} from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toTasksOverdueTable, taskOverdueHasData } from "../../utils";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const casesByTaskOverdueAssessment = useSelector(state =>
    getCasesByTaskOverdueAssessment(state)
  );
  const casesByTaskOverdueCasePlan = useSelector(state =>
    getCasesByTaskOverdueCasePlan(state)
  );
  const casesByTaskOverdueServices = useSelector(state =>
    getCasesByTaskOverdueServices(state)
  );
  const casesByTaskOverdueFollowups = useSelector(state =>
    getCasesByTaskOverdueFollowups(state)
  );

  const hasData = taskOverdueHasData(
    casesByTaskOverdueAssessment,
    casesByTaskOverdueCasePlan,
    casesByTaskOverdueServices,
    casesByTaskOverdueFollowups
  );

  const tasksOverdueProps = {
    ...toTasksOverdueTable(
      [
        casesByTaskOverdueAssessment,
        casesByTaskOverdueCasePlan,
        casesByTaskOverdueServices,
        casesByTaskOverdueFollowups
      ],
      i18n
    )
  };

  return (
    <Permission
      resources={RESOURCES.dashboards}
      actions={[
        ACTIONS.DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
        ACTIONS.DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
        ACTIONS.DASH_CASES_BY_TASK_OVERDUE_SERVICES,
        ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS
      ]}
    >
      <Grid item xl={9} md={8} xs={12}>
        <OptionsBox
          title={i18n.t("dashboard.cases_by_task_overdue")}
          hasData={hasData}
          {...loadingIndicator}
        >
          <DashboardTable {...tasksOverdueProps} />
        </OptionsBox>
      </Grid>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
