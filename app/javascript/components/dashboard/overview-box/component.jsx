import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../../i18n";
import { DoughnutChart } from "../doughnut-chart";

import styles from "./styles.css";

const OverviewBox = ({ items, chartData }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const transfers = items.get("transfers");
  const waiting = items.get("waiting");
  const pending = items.get("pending");
  const rejected = items.get("rejected");

  return (
    <div className={css.root}>
      <Grid container spacing={3}>
        <Grid item md={4} xs={12} className={css.dashboardChart}>
          <DoughnutChart chartData={chartData} />
        </Grid>
        <Grid item md={8} xs={12}>
          <div className={css.overviewBox}>
            <ul className={css.overviewList}>
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
  chartData: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired
};

export default OverviewBox;
