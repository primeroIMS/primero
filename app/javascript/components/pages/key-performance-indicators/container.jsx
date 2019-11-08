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
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

function PercentageBar({ percentage, className}) {
  let css = makeStyles(styles)();

  // Set a minimum of 5 percent so that there is always something
  // visible. It's not meant to be a super accurate assessment but
  // a quick visual assessment if we're using a percentage bar.
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

function DateRangeSelect({
  ranges,
  selectedRange,
  withCustomRange,
  setRange
}) {

  let [customRange, setCustomRange] = useState({
    value: 'custom-range',
    from: selectedRange.from,
    to: selectedRange.to,
    name: `${selectedRange.from} - ${selectedRange.to}`
  })

  console.log(ranges)

  return (
    <Select value={selectedRange.value}>
      { ranges.map(r => <MenuItem value={r.value}>{r.name}</MenuItem>) }
      { withCustomRange && <MenuItem value={customRange.value}>{customRange.name}</MenuItem> }
    </Select>
  )
}

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
      fetchNumberOfCases();
      fetchNumberOfIncidents();
      fetchReportingDelay();
    });
  }, []);

  let numberOfCasesColumns = ["REPORTING SITE", "SEP 2019", "AUG 2019", "JUL 2019"];
  let numberOfIncidentsColumns = ["REPORTING SITE", "SEP 2019", "AUG 2019", "JUL 2019"];
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

  let threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  let numberOfCasesDateRanges = [{
    value: '3-months',
    name: 'Last 3 Months',
    from: threeMonthsAgo,
    to: new Date()
  }]

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
                    action={
                      <DateRangeSelect
                        ranges={numberOfCasesDateRanges}
                        selectedRange={numberOfCasesDateRanges[0]}
                        withCustomRange
                      />
                    }
                  >
                    <DashboardTable
                      columns={numberOfCasesColumns}
                      data={numberOfCases.get('data')}
                    />
                  </OptionsBox>
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <OptionsBox
                    title="Number of Incidents"
                  >
                    <DashboardTable
                      columns={numberOfIncidentsColumns}
                      data={numberOfIncidents.get('data')}
                    />
                  </OptionsBox>
                </Grid>
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
