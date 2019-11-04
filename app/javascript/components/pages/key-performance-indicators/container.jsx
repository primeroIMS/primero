import { fromJS } from "immutable";
import PropTypes from "prop-types";
import React, { useEffect, useState, useReducer } from "react";
import { withRouter } from "react-router-dom";
import { connect, batch } from "react-redux";
import { PageContainer, PageHeading, PageContent } from "components/page";
import {
  Grid,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from "@material-ui/core";
import {
  ToggleButton,
  ToggleButtonGroup
} from "@material-ui/lab"
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

function KeyPerformanceIndicators({ fetchNumberOfCases, numberOfCases }) {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  useEffect(() => {
    batch(() => {
      fetchNumberOfCases();
    });
  }, []);

  const Actions = {
    SET_FROM_DATE: 'SET_FROM_DATE',
    SET_TO_DATE: 'SET_TO_DATE',
    SELECT_RANGE: 'SELECT_RANGE',
    OPEN_MENU: 'OPEN_MENU',
    CLOSE_MENU: 'CLOSE_MENU'
  }

  const Ranges = {
    THREE_MONTH: '3-months',
    CUSTOM_RANGE: 'custom-range'
  }

  let numberOfCasesInitialState = {
    menuOpen: false,
    selectedRange: Ranges.THREE_MONTH,
    fromDate: Date.now(),
    toDate: Date.now()
  }

  function numberOfCasesReducer(state, action) {
    switch (action.type) {
      case Actions.SET_FROM_DATE:
        return { ...state, fromDate: action.from }
      case Actions.SET_TO_DATE:
        return { ...state, toDate: action.to }
      case Actions.SELECT_RANGE:
        return { ...state, selectedRange: action.range, menuOpen: action.range === Ranges.CUSTOM_RANGE }
      case Actions.OPEN_MENU:
        return { ...state, menuOpen: true }
      case Actions.CLOSE_MENU:
        return { ...state, menuOpen: false }
      default:
        throw `Action ${action} not recognized`
    }
  }

  let [numberOfCasesState, updateNumberOfCases] = useReducer(numberOfCasesReducer, numberOfCasesInitialState)

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
                  <OptionsBox
                    title="Number of Cases"
                    action={
                      <div>
                        <ToggleButtonGroup
                          className={css.toggleButtonGroup}
                          exclusive
                          size="small"
                          onChange={(_event, value) => {
                            updateNumberOfCases({
                              type: Actions.SELECT_RANGE,
                              range: value
                            })
                          }}
                        >
                          <ToggleButton
                            value={Ranges.THREE_MONTH}
                            selected={numberOfCasesState.selectedRange === '3-months'}
                          >
                            <span>3 months</span>
                          </ToggleButton>
                          <ToggleButton
                            value={Ranges.CUSTOM_RANGE}
                            selected={numberOfCasesState.selectedRange === 'custom-range'}
                          >
                            <span>Custom Range</span>
                          </ToggleButton>
                        </ToggleButtonGroup>
                        <Dialog
                          open={numberOfCasesState.menuOpen}
                          onClose={() => updateNumberOfCases({
                            type: Actions.CLOSE_MENU
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
                                  value={numberOfCasesState.fromDate}
                                  onChange={(fromDate) => updateNumberOfCases({
                                    type: Actions.SET_FROM_DATE,
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
                                  value={numberOfCasesState.toDate}
                                  onChange={(toDate) => updateNumberOfCases({
                                    type: Actions.SET_TO_DATE,
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
                            <Button onClick={() => updateNumberOfCases({ type: Actions.CLOSE_MENU })}>Close</Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    }
                    to="/key-performance-indicators"
                  >
                    <DashboardTable
                      columns={numberOfCases.get('columns').toArray()}
                      data={numberOfCases.get('data')}
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
  })
};

const mapStateToProps = state => {
  return {
    numberOfCases: selectors.numberOfCases(state)
  };
};

const mapDispatchToProps = {
  fetchNumberOfCases: actions.fetchNumberOfCases
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(KeyPerformanceIndicators)
);
