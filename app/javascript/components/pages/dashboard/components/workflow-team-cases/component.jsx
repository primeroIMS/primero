// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIsDashboardGroupLoading, getWorkflowTeamCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toListTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { RECORD_TYPES, ROUTES } from "../../../../../config";
import { selectUserModules } from "../../../../application";
import { useMemoizedSelector } from "../../../../../libs";
import { getAllWorkflowLabels } from "../../../../application/selectors";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();
  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.workflow_team));
  const userModules = useMemoizedSelector(state => selectUserModules(state));
  const workflowLabels = useMemoizedSelector(state => getAllWorkflowLabels(state, RECORD_TYPES.cases));
  const casesWorkflowTeam = useMemoizedSelector(state => getWorkflowTeamCases(state));

  return userModules.map(userModule => {
    const title =
      userModules.size === 1
        ? i18n.t("dashboard.workflow_team")
        : i18n.t("dashboard.workflow_team_module", { module_name: userModule.name });
    const labels = workflowLabels.filter(moduleWorkflow => moduleWorkflow?.[2] === userModule.unique_id)?.[0];

    return (
      <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_WORKFLOW_TEAM}>
        <OptionsBox title={title} hasData={Boolean(casesWorkflowTeam.size) && !loading} loading={loading}>
          <DashboardTable
            pathname={ROUTES.cases}
            title={title}
            {...toListTable(casesWorkflowTeam, labels?.[1], [], i18n.locale, indicators => {
              return indicators[`workflow_team_${userModule.unique_id}`];
            })}
          />
        </OptionsBox>
      </Permission>
    );
  });
}

Component.displayName = NAME;

export default Component;
