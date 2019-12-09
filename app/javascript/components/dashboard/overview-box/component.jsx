import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { setDashboardFilters } from "../../filters-builder/action-creators";
import { ROUTES, RECORD_PATH } from "../../../config";
import { FROM_DASHBOARD_PARAMS } from "../constants";
import { buildFilter } from "../helpers";
import { DoughnutChart } from "../doughnut-chart";
import { useI18n } from "../../i18n";

import styles from "./styles.css";

const OverviewBox = ({ items, chartData, sumTitle }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const stats = items.get("stats", fromJS({}));
  const statsKeys = stats.keySeq();

  const sum = () => {
    return statsKeys.reduce(
      (prev, current) => prev + (stats.getIn([current, "count"]) || 0),
      0
    );
  };

  const handleClick = query => {
    dispatch(setDashboardFilters(RECORD_PATH.cases, buildFilter(query)));
    dispatch(
      push({
        pathname: ROUTES.cases,
        search: FROM_DASHBOARD_PARAMS
      })
    );
  };

  const statItems = () => {
    return stats.keySeq().map(item => {
      return (
        <li key={item}>
          <button
            className={css.itemButton}
            type="button"
            onClick={() => handleClick(stats.getIn([item, "query"], []))}
          >
            {stats.getIn([item, "count"])} {i18n.t(`dashboard.${item}`)}
          </button>
        </li>
      );
    });
  };

  const renderSum = () => {
    return `${sum()} ${sumTitle}`;
  };

  return (
    <div className={css.root}>
      <Grid container spacing={3}>
        {chartData && (
          <Grid item md={4} xs={12} className={css.dashboardChart}>
            <DoughnutChart chartData={chartData} />
          </Grid>
        )}
        <Grid item md={8} xs={12}>
          <div className={css.overviewBox}>
            <ul className={css.overviewList}>
              <li>{renderSum()}</li>
              {statItems()}
            </ul>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

OverviewBox.displayName = "OverviewBox";

OverviewBox.propTypes = {
  chartData: PropTypes.object,
  items: PropTypes.object.isRequired,
  sumTitle: PropTypes.string
};

export default OverviewBox;
