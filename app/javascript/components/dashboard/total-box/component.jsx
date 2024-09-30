// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { cx } from "@emotion/css";

import LoadingIndicator from "../../loading-indicator";
import NAMESPACE from "../../pages/dashboard/namespace";
import IndicatorItem from "../overview-box/indicator-item";
import dashboardsCss from "../styles.css";

import css from "./styles.css";

function TotalBox({ data, title, loading, errors }) {
  const loadingIndicatorProps = {
    overlay: true,
    hasData: data.size > 1,
    type: NAMESPACE,
    loading,
    errors
  };

  const [key, indicatorData] = data.get("indicators").entrySeq().first();

  const count = indicatorData.get("count", 0);
  const query = indicatorData.get("query", fromJS([]));

  const countClasses = cx({ [dashboardsCss.zero]: !count, [css.zero]: !count, [css.total]: true });
  const labelClasses = cx({ [dashboardsCss.zero]: !count, [css.zero]: !count, [css.footer]: true });

  return (
    <LoadingIndicator {...loadingIndicatorProps}>
      <div className={css.totalBox} data-testid="total-box">
        <div className={dashboardsCss.sectionTitle}>{title}</div>
        <IndicatorItem item={key} query={query} count={count} countClasses={countClasses} labelClasses={labelClasses} />
      </div>
    </LoadingIndicator>
  );
}

TotalBox.displayName = "TotalBox";

TotalBox.propTypes = {
  data: PropTypes.object.isRequired,
  errors: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string
};

export default TotalBox;
