import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import { getSharedWithMyTeam } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { teamSharingTable } from "../../helpers";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();
  const sharedWithMyTeam = useSelector(state => getSharedWithMyTeam(state));
  const sharedWithMyTeamProps = {
    ...teamSharingTable(sharedWithMyTeam, i18n)
  };

  return (
    <Permission
      resources={RESOURCES.dashboards}
      actions={ACTIONS.DASH_SHARED_WITH_MY_TEAM}
    >
      <Grid item xl={9} md={8} xs={12}>
        <OptionsBox
          title={i18n.t("dashboard.dash_shared_with_my_team")}
          {...loadingIndicator}
          hasData={Boolean(sharedWithMyTeam.size)}
        >
          <DashboardTable {...sharedWithMyTeamProps} />
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
