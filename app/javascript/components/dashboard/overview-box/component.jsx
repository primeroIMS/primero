// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { fromJS } from "immutable";

import Permission, { RESOURCES } from "../../permissions";
import DoughnutChart from "../doughnut-chart";

import css from "./styles.css";
import IndicatorSection from "./indicator-section";

function OverviewBox({ items, chartData, sumTitle, withTotal = true, loading, errors, subColumns }) {
  const indicators = items.get("indicators", fromJS({}));
  const indicatorSection = (
    <>
      <IndicatorSection
        indicators={indicators}
        loading={loading}
        errors={errors}
        sumTitle={sumTitle}
        withTotal={withTotal}
      />
      {subColumns?.map(subColumn => {
        const subIndicators = subColumn.items.get("indicators", fromJS({}));

        return (
          <Permission key={subColumn.actions} resources={RESOURCES.dashboards} actions={subColumn.actions}>
            <IndicatorSection
              indicators={subIndicators}
              loading={loading}
              errors={errors}
              sumTitle={subColumn.sumTitle}
              withTotal={subColumn.withTotal}
            />
          </Permission>
        );
      })}
    </>
  );

  if (chartData) {
    return (
      <div className={css.root} data-testid="overview-box">
        <Grid container spacing={3}>
          {chartData && (
            <Grid item md={4} xs={12} className={css.dashboardChart}>
              <DoughnutChart chartData={chartData} />
            </Grid>
          )}
          <Grid item md={8} xs={12}>
            {indicatorSection}
          </Grid>
        </Grid>
      </div>
    );
  }

  return indicatorSection;
}

OverviewBox.displayName = "OverviewBox";

OverviewBox.propTypes = {
  chartData: PropTypes.object,
  errors: PropTypes.bool,
  items: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  subColumns: PropTypes.object,
  sumTitle: PropTypes.string,
  withTotal: PropTypes.bool
};

export default OverviewBox;
