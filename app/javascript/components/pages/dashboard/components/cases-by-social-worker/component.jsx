// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { getCasesBySocialWorker, getIsDashboardGroupLoading } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toCasesBySocialWorkerTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { ROUTES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();

  const loading = useMemoizedSelector(state =>
    getIsDashboardGroupLoading(state, DASHBOARD_GROUP.cases_by_social_worker)
  );
  const data = useMemoizedSelector(state => getCasesBySocialWorker(state));

  const casesBySocialWorkerProps = {
    ...toCasesBySocialWorkerTable(data, i18n)
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_CASES_BY_SOCIAL_WORKER}>
      <OptionsBox
        title={i18n.t("dashboard.cases_by_social_worker")}
        hasData={Boolean(data.size) && !loading}
        loading={loading}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.cases_by_social_worker")}
          {...casesBySocialWorkerProps}
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
