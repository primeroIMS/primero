// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { getIsDashboardGroupLoading, getProtectionConcerns } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toProtectionConcernTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { getOption } from "../../../../record-form";
import { LOOKUPS, ROUTES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();
  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.protection_concerns));
  const protectionConcerns = useMemoizedSelector(state => getProtectionConcerns(state));
  const protectionConcernsLookup = useMemoizedSelector(state =>
    getOption(state, LOOKUPS.protection_concerns, i18n.locale)
  );

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_PROTECTION_CONCERNS}>
      <OptionsBox
        title={i18n.t("dashboard.protection_concerns")}
        hasData={Boolean(protectionConcerns.size) && !loading}
        loading={loading}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.protection_concerns")}
          {...toProtectionConcernTable(protectionConcerns, i18n, protectionConcernsLookup)}
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
