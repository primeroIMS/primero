import React, { useEffect } from "react";
import { connect, batch } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { Grid, Box, IconButton } from "@material-ui/core";
import { withRouter, Link, Route } from "react-router-dom";
import { OptionsBox, ActionMenu } from "components/dashboard";
import { BarChart } from "components/charts/bar-chart";
import AddIcon from "@material-ui/icons/Add";
import { PageContainer } from "components/page-container";
import makeStyles from "@material-ui/styles/makeStyles";
import { useI18n } from "components/i18n";
import { buildDataForReport } from "./helpers";
import { ReportDetail } from "./forms";
import * as actions from "./action-creators";
import * as selectors from "./selectors";
import styles from "./styles.css";

const Reports = ({
  match,
  fetchCasesByNationality,
  fetchCasesByAgeAndSex,
  fetchCasesByProtectionConcern,
  fetchCasesByAgency,
  casesByNationality,
  casesByAgeAndSex,
  casesByProtectionConcern,
  casesByAgency
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const actionMenuItems = fromJS([
    {
      id: "add-new",
      label: "Add New",
      onClick: () => console.log("Do Something")
    },
    {
      id: "arrange-items",
      label: "Arrange Items",
      onClick: () => console.log("Do Something")
    },
    {
      id: "refresh-data",
      label: "Refresh Data",
      onClick: () => console.log("Do Something")
    }
  ]);

  useEffect(() => {
    batch(() => {
      fetchCasesByNationality();
      fetchCasesByAgeAndSex();
      fetchCasesByProtectionConcern();
      fetchCasesByAgency();
    });
  }, []);

  return (
    <div>
      <PageContainer>
        <Grid item xs={12}>
          <Box alignItems="center" display="flex">
            <Box flexGrow={1}>
              <h1 className={css.title}>{i18n.t("reports.label")}</h1>
            </Box>
            <Box>
              <IconButton to="/reports" component={Link} className={css.new}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={6}>
            <OptionsBox
              title="CASE BY NATIONALITY"
              to={`${match.url}/casesByNationality`}
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
              <BarChart {...buildDataForReport(casesByNationality)} />
            </OptionsBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <OptionsBox
              title="CASES BY AGE AND SEX"
              to={`${match.url}/casesByAgeAndSex`}
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
              <BarChart {...buildDataForReport(casesByAgeAndSex)} />
            </OptionsBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <OptionsBox
              title="CASES BY PROTECTION CONCERN"
              to={`${match.url}/casesByProtectionConcern`}
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
              <BarChart {...buildDataForReport(casesByProtectionConcern)} />
            </OptionsBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <OptionsBox
              title="CASES BY AGENCY"
              to={`${match.url}/casesByAgency`}
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
              <BarChart {...buildDataForReport(casesByAgency)} />
            </OptionsBox>
          </Grid>
        </Grid>
      </PageContainer>
      <Route path={`${match.path}/:id`} component={ReportDetail} />
    </div>
  );
};

Reports.propTypes = {
  fetchCasesByNationality: PropTypes.func,
  fetchCasesByAgeAndSex: PropTypes.func,
  fetchCasesByProtectionConcern: PropTypes.func,
  fetchCasesByAgency: PropTypes.func,
  casesByNationality: PropTypes.object,
  casesByAgeAndSex: PropTypes.object,
  casesByProtectionConcern: PropTypes.object,
  casesByAgency: PropTypes.object,
  match: PropTypes.object
};

const mapStateToProps = state => {
  return {
    casesByNationality: selectors.selectCasesByNationality(state),
    casesByAgeAndSex: selectors.selectCasesByAgeAndSex(state),
    casesByProtectionConcern: selectors.selectCasesByProtectionConcern(state),
    casesByAgency: selectors.selectCasesByAgency(state)
  };
};

const mapDispatchToProps = {
  fetchCasesByNationality: actions.fetchCasesByNationality,
  fetchCasesByAgeAndSex: actions.fetchCasesByAgeAndSex,
  fetchCasesByProtectionConcern: actions.fetchCasesByProtectionConcern,
  fetchCasesByAgency: actions.fetchCasesByAgency
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Reports)
);
