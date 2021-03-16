import PropTypes from "prop-types";

import { getSharedWithMyTeam } from "../../selectors";
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

  const sharedWithMyTeam = useMemoizedSelector(state => getSharedWithMyTeam(state));

  const sharedWithMyTeamProps = {
    ...teamSharingTable(sharedWithMyTeam, i18n)
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_SHARED_WITH_MY_TEAM}>
      <OptionsBox
        title={i18n.t("dashboard.dash_shared_with_my_team")}
        {...loadingIndicator}
        hasData={Boolean(sharedWithMyTeam.size)}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.dash_shared_with_my_team")}
          {...sharedWithMyTeamProps}
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
