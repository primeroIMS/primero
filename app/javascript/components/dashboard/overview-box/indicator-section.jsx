import PropTypes from "prop-types";
import { useMemo } from "react";

import LoadingIndicator from "../../loading-indicator";
import NAMESPACE from "../../pages/dashboard/namespace";
import dashboardsCss from "../styles.css";

import css from "./styles.css";
import IndicatorItem from "./indicator-item";

function IndicatorSection({ indicators, loading, errors, sumTitle, withTotal, highlights = [] }) {
  const loadingIndicatorProps = {
    overlay: true,
    hasData: indicators.size > 1,
    type: NAMESPACE,
    loading,
    errors
  };

  const indicatorsKeys = indicators.keySeq();

  const sum = useMemo(
    () => indicatorsKeys.reduce((prev, current) => prev + (indicators.getIn([current, "count"]) || 0), 0),
    [indicatorsKeys]
  );

  const titleFormSum = withTotal ? `${sum} ${sumTitle}` : sumTitle;

  return (
    <LoadingIndicator {...loadingIndicatorProps}>
      <div className={css.overviewBox} data-testid="overview-box">
        <div className={dashboardsCss.sectionTitle}>{titleFormSum}</div>
        <div className={css.overviewList}>
          {indicators.entrySeq().map(([key, value]) => (
            <IndicatorItem
              item={key}
              key={key}
              count={value.get("count")}
              query={value.get("query")}
              highlight={highlights.includes(key)}
            />
          ))}
        </div>
      </div>
    </LoadingIndicator>
  );
}

IndicatorSection.displayName = "IndicatorSection";

IndicatorSection.propTypes = {
  errors: PropTypes.bool,
  highlights: PropTypes.array,
  indicators: PropTypes.object,
  items: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  subItems: PropTypes.object,
  sumTitle: PropTypes.string,
  withTotal: PropTypes.bool
};

export default IndicatorSection;
