import { fromJS } from "immutable";
import PropTypes from "prop-types";
import React, { useEffect, useState, useReducer } from "react";
import { withRouter } from "react-router-dom";
import { connect, batch } from "react-redux";
import { PageContainer, PageHeading, PageContent } from "components/page";
import {
  Grid,
  Box,
  Select,
  MenuItem
} from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { OptionsBox, DashboardTable } from "components/dashboard";
import {
  TablePercentageBar,
  DateRangeSelect,
  StackedPercentageBar
} from "components/key-performance-indicators";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import {
  NumberOfCases,
  NumberOfIncidents,
  ReportingDelay,
  ServiceAccessDelay,
  AssessmentStatus,
  CompletedCaseSafetyPlan,
  CompletedCaseActionPlan,
  CompletedSupervisorApprovedCaseActionPlan,
  ServicesProvided
} from "./components";
import * as actions from "./action-creators";
import * as selectors from "./selectors";


function KeyPerformanceIndicators({
  fetchNumberOfCases,
  numberOfCases,
  fetchNumberOfIncidents,
  numberOfIncidents,
  fetchReportingDelay,
  reportingDelay
}) {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  useEffect(() => {
    batch(() => {
      fetchReportingDelay();
    });
  }, []);

  return (
    <div>
      <PageContainer>
        <PageHeading title={i18n.t("key_performance_indicators.label")}></PageHeading>
        <PageContent>
          <Grid>
            <Box>
              <h2 className={css.subtitle}>INTRODUCTION &amp; ENGAGEMENT</h2>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <NumberOfCases />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <NumberOfIncidents />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <ReportingDelay />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <ServiceAccessDelay />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>CASE ASSESSMENT</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <AssessmentStatus />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>CASE ACTION PLANNING</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6} xl={4}>
                  <CompletedCaseSafetyPlan />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6} xl={4}>
                  <CompletedCaseActionPlan />
                </Grid>

                <Grid item className={css.grow} xs={12} xl={4}>
                  <CompletedSupervisorApprovedCaseActionPlan />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>CASE ACTION PLAN IMPLEMENTATION</h2>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ServicesProvided />
                </Grid>
              </Grid>
            </Box>


          </Grid>
        </PageContent>
      </PageContainer>
    </div>
  );
}

KeyPerformanceIndicators.propTypes = {
  fetchNumberOfCases: PropTypes.func,
  numberOfCases: PropTypes.shape({
    columns: PropTypes.array,
    data: PropTypes.array
  }),
  fetchNumberOfIncidents: PropTypes.func,
  numberOfIncidents: PropTypes.shape({
    columns: PropTypes.array,
    data: PropTypes.array
  }),
  fetchReportingDelay: PropTypes.func,
  reportingDelay: PropTypes.shape({
    columns: PropTypes.array,
    data: PropTypes.array
  })
};

const mapStateToProps = state => {
  return {
    numberOfCases: selectors.numberOfCases(state),
    numberOfIncidents: selectors.numberOfIncidents(state),
    reportingDelay: selectors.reportingDelay(state)
  };
};

const mapDispatchToProps = {
  fetchNumberOfCases: actions.fetchNumberOfCases,
  fetchNumberOfIncidents: actions.fetchNumberOfIncidents,
  fetchReportingDelay: actions.fetchReportingDelay
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(KeyPerformanceIndicators)
);
