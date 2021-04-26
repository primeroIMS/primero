import PropTypes from "prop-types";

import { getProtectionConcerns } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toProtectionConcernTable } from "../../utils";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { getOption } from "../../../../record-form";
import { LOOKUPS, ROUTES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const protectionConcerns = useMemoizedSelector(state => getProtectionConcerns(state));
  const protectionConcernsLookup = useMemoizedSelector(state =>
    getOption(state, LOOKUPS.protection_concerns, i18n.locale)
  );

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_PROTECTION_CONCERNS}>
      <OptionsBox
        title={i18n.t("dashboard.protection_concerns")}
        hasData={Boolean(protectionConcerns.size)}
        {...loadingIndicator}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.protection_concerns")}
          {...toProtectionConcernTable(protectionConcerns, i18n, protectionConcernsLookup)}
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
