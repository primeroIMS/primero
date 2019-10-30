import { fromJS } from "immutable";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
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
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
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

  let [numberOfCasesMenuOpen, setNumberOfCasesMenuOpen] = useState(false);
  let [selectedRange, setSelectedRange] = useState('3-months');

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
                          exclusive
                          onChange={(event, value) => {
                            if (value === 'custom-range' && selectedRange !== 'custom-range')
                              setNumberOfCasesMenuOpen(true);

                            setSelectedRange(value);
                          }}
                        >
                          <ToggleButton
                            value="3-months"
                            selected={selectedRange === '3-months'}
                          >
                            <span>3 months</span>
                          </ToggleButton>
                          <ToggleButton
                            value="custom-range"
                            selected={selectedRange === 'custom-range'}
                          >
                            <span>Custom Range</span>
                          </ToggleButton>
                        </ToggleButtonGroup>
                        <Dialog
                          open={numberOfCasesMenuOpen}
                          onClose={() => setNumberOfCasesMenuOpen(false)}
                        >
                          <DialogTitle>Date Range</DialogTitle>
                          <DialogContent>
                            <DialogContentText>See the number of case over the last 1, 3 or 6 month, or choose a custom time period.</DialogContentText>
                            <FormControl>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <FormControlLabel
                                  value="from"
                                  control={<DatePicker />}
                                  label="From"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  value="to"
                                  control={<DatePicker />}
                                  label="To"
                                  labelPlacement="start"
                                />
                              </MuiPickersUtilsProvider>
                            </FormControl>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setNumberOfCasesMenuOpen(false)}>Cancel</Button>
                            <Button onClick={() => setNumberOfCasesMenuOpen(false)}>Apply</Button>
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
