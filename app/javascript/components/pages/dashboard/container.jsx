import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  OptionsBox,
  DashboardTable,
  FlagBox,
  LineChart,
  OverviewBox
} from "components/dashboard";
import makeStyles from "@material-ui/styles/makeStyles";
import { withI18n } from "libs";
import * as actions from "./action-creators";
import * as selectors from "./selectors";
import styles from "./styles.css";

const Dashboard = ({
  fetchFlags,
  fetchCasesByStatus,
  fetchCasesByCaseWorker,
  fetchCasesRegistration,
  fetchCasesOverview,
  flags,
  casesByStatus,
  casesByCaseWorker,
  casesRegistration,
  casesOverview,
  doughnutInnerText,
  i18n
}) => {
  useEffect(() => {
    fetchFlags();
    fetchCasesByStatus();
    fetchCasesByCaseWorker();
    fetchCasesRegistration();
    fetchCasesOverview();
  }, []);

  const css = makeStyles(styles)();
  const columns = [
    { label: i18n.t("dashboard.case_worker"), name: "case_worker", id: true },
    { label: i18n.t("dashboard.assessment"), name: "assessment" },
    { label: i18n.t("dashboard.case_plan"), name: "case_plan" },
    { label: i18n.t("dashboard.follow_up"), name: "follow_up" },
    { label: i18n.t("dashboard.services"), name: "services" }
  ];

  const casesChartData = {
    innerText: doughnutInnerText,
    labels: [i18n.t("dashboard.open"), i18n.t("dashboard.closed")],
    datasets: [
      {
        data: [casesByStatus.get("open"), casesByStatus.get("closed")],
        backgroundColor: ["#0094BE", "#E0DFD6"]
      }
    ]
  };

  const registrationChartData = {
    labels: casesRegistration.keySeq().toJS(),
    datasets: [
      {
        data: casesRegistration.valueSeq().toJS(),
        lineTension: 0.1,
        steppedLine: false
      }
    ]
  };

  return (
    <div style={{ padding: 15 }}>
      <Grid container spacing={3}>
        <Grid item md={10}>
          <h1 className={css.Title}>HOME</h1>
        </Grid>
        <Grid item md={2}>
          <div className={css.PageOptions}>
            <IconButton aria-label="Settings">
              <MoreVertIcon className={css.PageButtons} />
            </IconButton>
          </div>
        </Grid>
        <Grid item md={8}>
          <OptionsBox title="CASE OVERVIEW">
            <OverviewBox items={casesOverview} chartData={casesChartData} />
          </OptionsBox>
          <OptionsBox title={i18n.t("dashboard.cases_by_task_overdue")}>
            <DashboardTable columns={columns} data={casesByCaseWorker} />
          </OptionsBox>
          <OptionsBox title={i18n.t("dashboard.registration")}>
            <LineChart
              chartData={registrationChartData}
              title="Total case registrations over time"
            />
          </OptionsBox>
        </Grid>
        <Grid item md={4} sm={12}>
          <OptionsBox title={i18n.t("dashboard.flagged")}>
            {flags.map(flag => {
              return <FlagBox flag={flag} key={flag.get("id")} />;
            })}
          </OptionsBox>
        </Grid>
      </Grid>
    </div>
  );
};

Dashboard.propTypes = {
  flags: PropTypes.object.isRequired,
  doughnutInnerText: PropTypes.array.isRequired,
  casesByStatus: PropTypes.object.isRequired,
  casesByCaseWorker: PropTypes.object.isRequired,
  casesRegistration: PropTypes.object.isRequired,
  casesOverview: PropTypes.object.isRequired,
  fetchFlags: PropTypes.func.isRequired,
  fetchCasesByStatus: PropTypes.func.isRequired,
  fetchCasesByCaseWorker: PropTypes.func.isRequired,
  fetchCasesRegistration: PropTypes.func.isRequired,
  fetchCasesOverview: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    flags: selectors.selectFlags(state),
    doughnutInnerText: selectors.getDoughnutInnerText(state),
    casesByStatus: selectors.selectCasesByStatus(state),
    casesByCaseWorker: selectors.selectCasesByCaseWorker(state),
    casesRegistration: selectors.selectCasesRegistration(state),
    casesOverview: selectors.selectCasesOverview(state)
  };
};

const mapDispatchToProps = {
  fetchFlags: actions.fetchFlags,
  fetchCasesByStatus: actions.fetchCasesByStatus,
  fetchCasesByCaseWorker: actions.fetchCasesByCaseWorker,
  fetchCasesRegistration: actions.fetchCasesRegistration,
  fetchCasesOverview: actions.fetchCasesOverview
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
