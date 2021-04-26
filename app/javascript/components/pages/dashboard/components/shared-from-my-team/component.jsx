import PropTypes from "prop-types";

import { getSharedFromMyTeam } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { teamSharingTable } from "../../utils";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { ROUTES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const sharedFromMyTeam = useMemoizedSelector(state => getSharedFromMyTeam(state));

  const sharedFromMyTeamProps = {
    ...teamSharingTable(sharedFromMyTeam, i18n)
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_SHARED_FROM_MY_TEAM}>
      <OptionsBox
        title={i18n.t("dashboard.dash_shared_from_my_team")}
        {...loadingIndicator}
        hasData={Boolean(sharedFromMyTeam.size)}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.dash_shared_from_my_team")}
          {...sharedFromMyTeamProps}
        />
      </OptionsBox>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
