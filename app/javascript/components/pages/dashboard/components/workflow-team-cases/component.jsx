import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import { getWorkflowTeamCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toListTable } from "../../utils";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { MODULES, RECORD_TYPES } from "../../../../../config";
import { selectModule } from "../../../../application";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const workflowLabels = useSelector(
    state =>
      selectModule(state, MODULES.CP)?.workflows?.[RECORD_TYPES.cases]?.[
        i18n.locale
      ]
  );

  const casesWorkflowTeam = useSelector(state => getWorkflowTeamCases(state));

  return (
    <Permission
      resources={RESOURCES.dashboards}
      actions={ACTIONS.DASH_WORKFLOW_TEAM}
    >
      <Grid item xl={9} md={8} xs={12}>
        <OptionsBox
          title={i18n.t("dashboard.workflow_team")}
          hasData={Boolean(casesWorkflowTeam.size)}
          {...loadingIndicator}
        >
          <DashboardTable {...toListTable(casesWorkflowTeam, workflowLabels)} />
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
