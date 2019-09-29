import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Grid, Box, IconButton } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { BarChart as BarChartGraphic, TableValues } from "components/charts";
import { ArrowBackIos, TableChart, BarChart } from "@material-ui/icons";
import makeStyles from "@material-ui/styles/makeStyles";
import { useI18n } from "components/i18n";
import { buildDataForGraph, buildDataForTable } from "../helpers";
import * as selectors from "../selectors";
import * as actions from "../action-creators";
import styles from "./styles.css";

const ReportDetail = ({ report, match, fetchReport }) => {
  const css = makeStyles(styles)();
  const { params } = match;
  const i18n = useI18n();

  useEffect(() => {
    fetchReport(params.id);
  }, []);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box alignItems="center" display="flex">
            <Box flexGrow={1}>
              <h1 className={css.title}>
                <IconButton to="/reports" component={Link}>
                  <ArrowBackIos />
                </IconButton>
                {report.get("name") ? report.get("name").get(i18n.locale) : ""}
              </h1>
            </Box>
            <Box>
              <IconButton
                to="/reports"
                component={Link}
                className={css.exportButton}
              >
                <BarChart />
              </IconButton>
              <IconButton
                to="/reports"
                component={Link}
                className={css.exportButton}
              >
                <TableChart />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        {report.get("graph") ? (
          <Grid item xs={12}>
            <BarChartGraphic {...buildDataForGraph(report, i18n)} showDetails />
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <TableValues {...buildDataForTable(report, i18n)} />
        </Grid>
      </Grid>
    </div>
  );
};

ReportDetail.propTypes = {
  match: PropTypes.object.isRequired,
  report: PropTypes.object.isRequired,
  fetchReport: PropTypes.func
};

const mapStateToProps = (state, props) => {
  return {
    report: selectors.selectReport(state, props.match.params.id)
  };
};

const mapDispatchToProps = {
  fetchReport: actions.fetchReport
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReportDetail)
);
