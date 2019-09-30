import { fromJS } from "immutable";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { PageContainer } from "components/page-container";
import { Grid, Box } from "@material-ui/core";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

function KeyPerformanceIndicators({ numberOfCases }) {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <div>
      <PageContainer>
        <Grid item xs={12}>
          <Box alignItems="center" display="flex">
            <Box flexgrow={1}>
              <h1 className={css.title}>
                {i18n.t("key_performance_indicators.label")}
              </h1>
            </Box>
          </Box>
        </Grid>

        <Grid>
          <Box>
            <h2 className={css.subtitle}>INTRODUCTION &amp; ENGAGEMENT</h2>
            <Grid container spacing={2}>
              <Grid item>
                <OptionsBox
                  title="Number of Cases"
                  to="/key-performance-indicators"
                >
                  <DashboardTable
                    columns={fromJS(numberOfCases.columns)}
                    data={fromJS(numberOfCases.data)}
                  />
                </OptionsBox>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </PageContainer>
    </div>
  );
}

KeyPerformanceIndicators.propTypes = {
  numberOfCases: {
    columns: PropTypes.array,
    data: PropTypes.array
  }
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
