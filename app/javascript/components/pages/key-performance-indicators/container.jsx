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
  FormControl
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

const KPICardActions = {
  SET_FROM_DATE: 'SET_FROM_DATE',
  SET_TO_DATE: 'SET_TO_DATE',
  SELECT_RANGE: 'SELECT_RANGE',
  OPEN_MENU: 'OPEN_MENU',
  CLOSE_MENU: 'CLOSE_MENU'
}

const KPICardRanges = {
  THREE_MONTH: '3-months',
  CUSTOM_RANGE: 'custom-range'
}

let KPICardInitialState = {
  menuOpen: false,
  selectedRange: KPICardRanges.THREE_MONTH,
  fromDate: Date.now(),
  toDate: Date.now()
}

function kpiCardReducer(state, action) {
  switch (action.type) {
    case KPICardActions.SET_FROM_DATE:
      return { ...state, fromDate: action.from }
    case KPICardActions.SET_TO_DATE:
      return { ...state, toDate: action.to }
    case KPICardActions.SELECT_RANGE:
      return { ...state, selectedRange: action.range, menuOpen: action.range === KPICardRanges.CUSTOM_RANGE }
    case KPICardActions.OPEN_MENU:
      return { ...state, menuOpen: true }
    case KPICardActions.CLOSE_MENU:
      return { ...state, menuOpen: false }
    default:
      throw `Action ${action} not recognized`
  }
}

function KPICard({ title, KPITableData }) {
  const i18n = useI18n();
  const css = makeStyles(styles)();


  let [kpiCard, updateKPICard] = useReducer(kpiCardReducer, KPICardInitialState)

  return <OptionsBox
    title={title}
    action={
      <div>
        <ToggleButtonGroup
          className={css.toggleButtonGroup}
          exclusive
          size="small"
          onChange={(_event, value) => {
            updateKPICard({
              type: KPICardActions.SELECT_RANGE,
              range: value
            })
          }}
        >
          <ToggleButton
            value={KPICardRanges.THREE_MONTH}
            selected={kpiCard.selectedRange === KPICardRanges.THREE_MONTH}
          >
            <span>3 months</span>
          </ToggleButton>
          <ToggleButton
            value={KPICardRanges.CUSTOM_RANGE}
            selected={kpiCard.selectedRange === KPICardRanges.CUSTOM_RANGE}
          >
            <span>Custom Range</span>
          </ToggleButton>
        </ToggleButtonGroup>
        <Dialog
          open={kpiCard.menuOpen}
          onClose={() => updateKPICard({
            type: KPICardActions.CLOSE_MENU
          })}
        >
          <DialogTitle>Date Range</DialogTitle>
          <DialogContent>
            <DialogContentText>Show data between these two dates.</DialogContentText>
            <FormControl>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  label="From"
                  value={kpiCard.fromDate}
                  onChange={(fromDate) => updateKPICard({
                    type: KPICardActions.SET_FROM_DATE,
                    from: fromDate
                  })}
                    KeyboardButtonProps={{
                      'aria-label': 'Select data after this date'
                    }}
                  />
                  <KeyboardDatePicker
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    label="To"
                    value={kpiCard.toDate}
                    onChange={(toDate) => updateKPICard({
                      type: KPICardActions.SET_TO_DATE,
                      to: toDate
                    })}
                      KeyboardButtonProps={{
                        'aria-label': 'Select data before this date'
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => updateKPICard({ type: KPICardActions.CLOSE_MENU })}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>
    }
  >
    <DashboardTable
      columns={KPITableData.get('columns').toArray()}
      data={KPITableData.get('data')}
    />
  </OptionsBox>
}

function KeyPerformanceIndicators({ fetchNumberOfCases, numberOfCases, fetchReportingDelay, reportingDelay }) {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  useEffect(() => {
    batch(() => {
      fetchNumberOfCases();
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
                <Grid item>
                  <KPICard title="Number of Cases" KPITableData={numberOfCases} />
                  <KPICard title="Reporting Delay" KPITableData={reportingDelay} />
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
