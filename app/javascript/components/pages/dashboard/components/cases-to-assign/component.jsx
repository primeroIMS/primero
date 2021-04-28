import PropTypes from "prop-types";
import { fromJS } from "immutable";

import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { getOptions } from "../../../../form/selectors";
import { LOOKUPS, ROUTES } from "../../../../../config";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { useI18n } from "../../../../i18n";
import { useMemoizedSelector } from "../../../../../libs";
import { getCasesToAssign } from "../../selectors";
import { toCasesToAssignTable } from "../../utils";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();
  const casesToAssign = useMemoizedSelector(state => getCasesToAssign(state));
  const options = useMemoizedSelector(state => getOptions(state, LOOKUPS.risk_level, i18n));

  const hasData = Boolean(casesToAssign.get("indicators", fromJS({})).size);

  const casesToAssignTableProps = toCasesToAssignTable(casesToAssign, options, i18n);

  return (
    <Permission resources={RESOURCES.dashboards} actions={[ACTIONS.DASH_CASES_TO_ASSIGN]}>
      <OptionsBox title={i18n.t("dashboard.cases_to_assign")} hasData={hasData} {...loadingIndicator}>
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.cases_to_assign")}
          {...casesToAssignTableProps}
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
