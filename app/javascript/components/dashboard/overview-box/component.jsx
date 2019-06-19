import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { withI18n } from "libs";
import { DoughnutChart } from "components/dashboard/doughnut-chart";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const OverviewBox = ({ i18n, items, chartData }) => {
  const css = makeStyles(styles)();
  const transfers = items.get("transfers");
  const waiting = items.get("waiting");
  const pending = items.get("pending");
  const rejected = items.get("rejected");
  return (
    <div className={css.Root}>
      <Grid container spacing={3}>
        <Grid item xs={4} className={css.DashboardChart}>
          <DoughnutChart chartData={chartData} />
        </Grid>
        <Grid item xs={8}>
          <div className={css.OverviewBox}>
            <ul className={css.OverviewList}>
              <li>
                {transfers} {i18n.t("dashboard.outstanding_transfers")}
              </li>
              <li>
                {waiting} {i18n.t("dashboard.awaiting_acceptance")}
              </li>
              <li>
                {pending} {i18n.t("dashboard.pending")}
              </li>
              <li>
                {rejected} {i18n.t("dashboard.rejected")}
              </li>
            </ul>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

OverviewBox.propTypes = {
  items: PropTypes.object.isRequired,
  chartData: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default withI18n(OverviewBox);
