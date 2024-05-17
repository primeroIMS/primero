// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import StackedPercentageBar from "../stacked-percentage-bar";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../permissions";

import css from "./styles.css";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();

  const rate = data.get("data").get("satisfaction_rate");

  if (rate === null)
    return <p className={css.invalidMessage}>{i18n.t(`key_performance_indicators.${identifier}.invalid`)}</p>;

  return (
    <StackedPercentageBar
      percentages={[
        {
          percentage: rate,
          label: i18n.t(`key_performance_indicators.${identifier}.label`)
        }
      ]}
    />
  );
};

Component.displayName = "ClientSatisfactionRate";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "client_satisfaction_rate",
  { data: { satisfaction_rate: 0 } },
  ACTIONS.KPI_CLIENT_SATISFACTION_RATE
)(Component);
