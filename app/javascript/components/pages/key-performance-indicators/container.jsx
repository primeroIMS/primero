import { fromJS } from "immutable";
import PropTypes from "prop-types";
import React, { useEffect, useReducer } from "react";
import { withRouter } from "react-router-dom";
import { connect, batch } from "react-redux";
import { PageContainer, PageHeading, PageContent } from "components/page";
import {
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  LinearProgress
} from "@material-ui/core";
import {
  ToggleButton,
  ToggleButtonGroup
} from "@material-ui/lab"
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

function PercentageBar({ percentage, className}) {
  let css = makeStyles(styles)();

  const percentageValue = Math.max(5, percentage * 100);
  const isZero = percentage === 0;

  const barClassNames = [css.PercentageBar, className].join(' ');
  const fillingClassNames = [
    css.PercentageBarComplete,
    isZero ? css.bgGrey : css.bgBlue
  ].join(' ');

  return (
    <div className={barClassNames}>
      <div
        className={fillingClassNames}
        style={{ width: percentageValue + "%" }}></div>
    </div>
  )
}

function KeyPerformanceIndicators({
  fetchNumberOfCases,
  numberOfCases,
  fetchReportingDelay,
  reportingDelay
}) {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  useEffect(() => {
    batch(() => {
      fetchNumberOfCases();
      fetchReportingDelay();
    });
  }, []);

  let numberOfCasesColumns = ["REPORTING SITE", "SEP 2019", "AUG 2019", "JUL 2019"];
  let reportingDelayColumns = [
    "Delay",
    "Total Cases",
    {
      name: "",
      options: {
        customBodyRender: (value) => {
          return (<PercentageBar
            percentage={value}
            className={css.percentageBarWithinTableCell}
          />);
        }
      }
    }
  ];

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
                  <OptionsBox
                    title="Number of Cases"
                  >
                    <DashboardTable
                      columns={numberOfCasesColumns}
                      data={numberOfCases.get('data')}
                    />
                  </OptionsBox>
                </Grid>
                <Grid item className={css.grow} xs={12} md={6}>
                  <OptionsBox
                    title="Reporting Delay"
                  >
                    <DashboardTable
                      columns={reportingDelayColumns}
                      data={reportingDelay.get('data')}
                    />
                  </OptionsBox>
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
  fetchReportingDelay: PropTypes.func,
  reportingDelay: PropTypes.shape({
    columns: PropTypes.array,
    data: PropTypes.array
  })
};

const mapStateToProps = state => {
  return {
    numberOfCases: selectors.numberOfCases(state),
    reportingDelay: selectors.reportingDelay(state)
  };
};

const mapDispatchToProps = {
  fetchNumberOfCases: actions.fetchNumberOfCases,
  fetchReportingDelay: actions.fetchReportingDelay
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(KeyPerformanceIndicators)
);
