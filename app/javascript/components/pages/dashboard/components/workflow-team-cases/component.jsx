// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { getWorkflowTeamCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toListTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { RECORD_TYPES, ROUTES } from "../../../../../config";
import { getWorkflowLabels } from "../../../../application";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";

function Component({ loadingIndicator }) {
  const i18n = useI18n();

  const workflowLabels = useMemoizedSelector(state => getWorkflowLabels(state, null, RECORD_TYPES.cases));
  const casesWorkflowTeam = useMemoizedSelector(state => getWorkflowTeamCases(state));

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_WORKFLOW_TEAM}>
      <OptionsBox
        title={i18n.t("dashboard.workflow_team")}
        hasData={Boolean(casesWorkflowTeam.size)}
        {...loadingIndicator}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.workflow_team")}
          {...toListTable(casesWorkflowTeam, workflowLabels, [], i18n.locale)}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
