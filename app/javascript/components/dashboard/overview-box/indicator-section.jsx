import PropTypes from "prop-types";
import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";

import LoadingIndicator from "../../loading-indicator";
import NAMESPACE from "../../pages/dashboard/namespace";
import { reduceMapToObject } from "../../../libs";
import sortWithSortedArray from "../../insights-sub-report/utils/sort-with-sorted-array";
import dashboardsCss from "../styles.css";

import css from "./styles.css";
import IndicatorItem from "./indicator-item";

function IndicatorSection({
  titleHasModule,
  indicators,
  loading,
  errors,
  sumTitle,
  withTotal,
  highlights = [],
  displayOrder = []
}) {
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

  const sortedKeys = useMemo(() => {
    const plainKeys = reduceMapToObject(indicatorsKeys) || [];

    return !isEmpty(displayOrder) ? sortWithSortedArray(plainKeys, displayOrder) : plainKeys;
  }, [indicatorsKeys?.join(","), displayOrder?.join(",")]);

  const titleFormSum = withTotal ? `${sum} ${sumTitle}` : sumTitle;

  return (
    <LoadingIndicator {...loadingIndicatorProps}>
      <div className={css.overviewBox} data-testid="overview-box">
        <div className={dashboardsCss.sectionTitle}>{titleFormSum}</div>
        <div className={css.overviewList}>
          {sortedKeys.map(key => {
            const value = indicators.get(key);

            return (
              <IndicatorItem
                titleHasModule={titleHasModule}
                item={key}
                key={key}
                count={value.get("count")}
                query={value.get("query")}
                highlight={highlights.includes(key)}
              />
            );
          })}
        </div>
      </div>
    </LoadingIndicator>
  );
}

IndicatorSection.displayName = "IndicatorSection";

IndicatorSection.propTypes = {
  displayOrder: PropTypes.func,
  errors: PropTypes.bool,
  highlights: PropTypes.array,
  indicators: PropTypes.object,
  items: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  subItems: PropTypes.object,
  sumTitle: PropTypes.string,
  titleHasModule: PropTypes.bool,
  withTotal: PropTypes.bool
};

export default IndicatorSection;
