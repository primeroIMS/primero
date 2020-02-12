import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { ROUTES } from "../../../config";
import { buildFilter } from "../helpers";
import { DoughnutChart } from "../doughnut-chart";
import { useI18n } from "../../i18n";
import { LoadingIndicator } from "../../loading-indicator";
import NAMESPACE from "../../pages/dashboard/namespace";

import styles from "./styles.css";

const OverviewBox = ({
  items,
  chartData,
  sumTitle,
  withTotal,
  loading,
  errors
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const indicators = items.get("indicators", fromJS({}));
  const indicatorsKeys = indicators.keySeq();

  const loadingIndicatorProps = {
    overlay: true,
    hasData: indicators.size > 1,
    type: NAMESPACE,
    loading,
    errors
  };

  const sum = () => {
    return indicatorsKeys.reduce(
      (prev, current) => prev + (indicators.getIn([current, "count"]) || 0),
      0
    );
  };

  const handleClick = query => {
    dispatch(
      push({
        pathname: ROUTES.cases,
        search: buildFilter(query)
      })
    );
  };

  const statItems = () => {
    return indicators.keySeq().map(item => {
      return (
        <li key={item}>
          <button
            className={css.itemButton}
            type="button"
            onClick={() => handleClick(indicators.getIn([item, "query"], []))}
          >
            {indicators.getIn([item, "count"])} {i18n.t(`dashboard.${item}`)}
          </button>
        </li>
      );
    });
  };

  const renderSum = () => {
    return withTotal ? `${sum()} ${sumTitle}` : sumTitle;
  };

  const renderItems = () => (
    <LoadingIndicator {...loadingIndicatorProps}>
      <div className={css.overviewBox}>
        <div className={css.sectionTitle}>{renderSum()}</div>
        <ul className={css.overviewList}>
          {statItems()}
        </ul>
      </div>
    </LoadingIndicator>
  );

  const renderWithChart = () => (
    <div className={css.root}>
      <Grid container spacing={3}>
        {chartData && (
          <Grid item md={4} xs={12} className={css.dashboardChart}>
            <DoughnutChart chartData={chartData} />
          </Grid>
        )}
        <Grid item md={8} xs={12}>
          {renderItems()}
        </Grid>
      </Grid>
    </div>
  );

  const renderOverviewBox = chartData ? renderWithChart() : renderItems();

  return <>{renderOverviewBox}</>;
};

OverviewBox.defaultProps = {
  withTotal: true
};

OverviewBox.displayName = "OverviewBox";

OverviewBox.propTypes = {
  chartData: PropTypes.object,
  errors: PropTypes.bool,
  items: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  sumTitle: PropTypes.string,
  withTotal: PropTypes.bool
};

export default OverviewBox;
