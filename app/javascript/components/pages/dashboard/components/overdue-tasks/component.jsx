// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import {
  getCasesByTaskOverdueAssessment,
  getCasesByTaskOverdueCasePlan,
  getCasesByTaskOverdueServices,
  getCasesByTaskOverdueFollowups,
  getIsDashboardGroupLoading,
  getDashboardGroupHasData
} from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toTasksOverdueTable } from "../../utils";
import Permission, { RESOURCES } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { ROUTES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import { DASHBOARD_GROUP } from "../../constants";
import { OVERDUE_TASKS_DASHBOARD } from "../../../../permissions/constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();
  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.overdue_tasks));
  const hasData = useMemoizedSelector(state => getDashboardGroupHasData(state, DASHBOARD_GROUP.overdue_tasks));
  const casesByTaskOverdueAssessment = useMemoizedSelector(state => getCasesByTaskOverdueAssessment(state));
  const casesByTaskOverdueCasePlan = useMemoizedSelector(state => getCasesByTaskOverdueCasePlan(state));
  const casesByTaskOverdueServices = useMemoizedSelector(state => getCasesByTaskOverdueServices(state));
  const casesByTaskOverdueFollowups = useMemoizedSelector(state => getCasesByTaskOverdueFollowups(state));

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
    <Permission resources={RESOURCES.dashboards} actions={OVERDUE_TASKS_DASHBOARD}>
      <OptionsBox title={i18n.t("dashboard.cases_by_task_overdue")} hasData={hasData && !loading} loading={loading}>
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.cases_by_task_overdue")}
          {...tasksOverdueProps}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
