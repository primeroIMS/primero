import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Grid, Box, IconButton } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { BarChart as BarChartGraphic, TableValues } from "components/charts";
import { ArrowBackIos, TableChart, BarChart } from "@material-ui/icons";
import makeStyles from "@material-ui/styles/makeStyles";
import { buildDataForReport, buildDataForTable } from "../helpers";
import * as selectors from "../selectors";
import styles from "./styles.css";

const ReportDetail = ({ report }) => {
  const css = makeStyles(styles)();
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box alignItems="center" display="flex">
            <Box flexGrow={1}>
              <h1 className={css.Title}>
                <IconButton to="/reports" component={Link}>
                  <ArrowBackIos />
                </IconButton>
                {report.get("title")}
              </h1>
            </Box>
            <Box>
              <IconButton
                to="/reports"
                component={Link}
                className={css.ExportButton}
              >
                <BarChart />
              </IconButton>
              <IconButton
                to="/reports"
                component={Link}
                className={css.ExportButton}
              >
                <TableChart />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <BarChartGraphic {...buildDataForReport(report)} showDetails />
        </Grid>
        <Grid item xs={12}>
          <TableValues {...buildDataForTable(report)} />
        </Grid>
      </Grid>
    </div>
  );
};

ReportDetail.propTypes = {
  match: PropTypes.object,
  report: PropTypes.object
};

const mapStateToProps = (state, props) => {
  return {
    report: selectors.selectReport(state, props.match.params.id)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(ReportDetail)
);
