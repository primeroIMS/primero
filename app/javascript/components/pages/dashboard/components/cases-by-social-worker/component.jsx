import PropTypes from "prop-types";

import { getCasesBySocialWorker } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toCasesBySocialWorkerTable } from "../../utils";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { ROUTES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const data = useMemoizedSelector(state => getCasesBySocialWorker(state));

  const casesBySocialWorkerProps = {
    ...toCasesBySocialWorkerTable(data, i18n)
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_CASES_BY_SOCIAL_WORKER}>
      <OptionsBox title={i18n.t("dashboard.cases_by_social_worker")} hasData={Boolean(data.size)} {...loadingIndicator}>
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.cases_by_social_worker")}
          {...casesBySocialWorkerProps}
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
