import PropTypes from "prop-types";

import { getPerpetratorArmedForceGroupPartyNames } from "../../selectors";
import { useI18n } from "../../../../i18n";
import toFacetedTable from "../../utils/to-faceted-table";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { LOOKUPS, ROUTES } from "../../../../../config";
import useOptions from "../../../../form/use-options";
import { useMemoizedSelector } from "../../../../../libs";
import { INDICATOR_NAMES } from "../../constants";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const armedForceGroupOrOtherParty = useOptions({ source: LOOKUPS.armed_force_group_or_other_party });

  const perpetratorArmedForceGroupPartyNames = useMemoizedSelector(state =>
    getPerpetratorArmedForceGroupPartyNames(state)
  );

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES}>
      <OptionsBox
        title={i18n.t("dashboard.dash_perpetrator_armed_force_group_party_names")}
        hasData={Boolean(perpetratorArmedForceGroupPartyNames.size)}
        {...loadingIndicator}
      >
        <DashboardTable
          pathname={ROUTES.incidents}
          title={i18n.t("dashboard.dash_perpetrator_armed_force_group_party_names")}
          {...toFacetedTable(
            perpetratorArmedForceGroupPartyNames,
            i18n.t("dashboard.total"),
            armedForceGroupOrOtherParty,
            INDICATOR_NAMES.PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES
          )}
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
