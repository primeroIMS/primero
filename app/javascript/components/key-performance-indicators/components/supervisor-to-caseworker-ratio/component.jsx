import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import SingleAggregateMetric from "../single-aggregate-metric";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../../libs/permissions";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();
  const supervisors = data.get("data").get("supervisors");
  const caseWorkers = data.get("data").get("case_workers");

  return (
    <SingleAggregateMetric
      value={`${caseWorkers}:${supervisors}`}
      label={i18n.t(`key_performance_indicators.${identifier}.label`)}
    />
  );
};

Component.displayName = "SupervisorToCaseworkerRatio";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "supervisor_to_caseworker_ratio",
  { data: { supervisors: 0, case_workers: 0 } },
  ACTIONS.KPI_SUPERVISOR_TO_CASEWORKER_RATIO
)(Component);
