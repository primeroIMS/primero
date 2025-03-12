// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { fromJS } from "immutable";

import DoughnutChart from "../doughnut-chart";

import css from "./styles.css";
import IndicatorSection from "./indicator-section";

function OverviewBox({ items, chartData, sumTitle, withTotal = true, loading, errors, highlights = [] }) {
  const indicators = items.get("indicators", fromJS({}));
  const indicatorSection = (
    <>
      <IndicatorSection
        indicators={indicators}
        loading={loading}
        errors={errors}
        sumTitle={sumTitle}
        withTotal={withTotal}
        highlights={highlights}
      />
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
  highlights: PropTypes.array,
  items: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  sumTitle: PropTypes.string,
  withTotal: PropTypes.bool
};

export default OverviewBox;
