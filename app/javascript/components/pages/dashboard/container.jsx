import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, batch } from "react-redux";
import { Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import makeStyles from "@material-ui/styles/makeStyles";

import {
  OptionsBox,
  DashboardTable,
  LineChart,
  OverviewBox
} from "../../dashboard";
import { FlagList } from "../../dashboard/flag-list";
import { Services } from "../../dashboard/services";
import { useI18n } from "../../i18n";
import { PageContainer, PageHeading, PageContent } from "../../page";

import * as actions from "./action-creators";
import {
  selectFlags,
  selectCasesByStatus,
  selectCasesByCaseWorker,
  selectCasesRegistration,
  selectCasesOverview,
  selectServicesStatus
} from "./selectors";
import styles from "./styles.css";

const Dashboard = ({
  fetchFlags,
  fetchCasesByStatus,
  fetchCasesByCaseWorker,
  fetchCasesRegistration,
  fetchCasesOverview,
  fetchServicesStatus,
  flags,
  casesByStatus,
  casesByCaseWorker,
  casesRegistration,
  casesOverview,
  servicesStatus
}) => {
  useEffect(() => {
    batch(() => {
      fetchFlags();
      fetchCasesByStatus();
      fetchCasesByCaseWorker();
      fetchCasesRegistration();
      fetchCasesOverview();
      fetchServicesStatus();
    });
  }, [
    fetchCasesByCaseWorker,
    fetchCasesByStatus,
    fetchCasesOverview,
    fetchCasesRegistration,
    fetchFlags,
    fetchServicesStatus
  ]);

  const css = makeStyles(styles)();

  const theme = useTheme();

  const i18n = useI18n();

  const getDoughnutInnerText = () => {
    const text = [];
    const openCases = casesByStatus.get("open");
    const closedCases = casesByStatus.get("closed");
    const baseFontStyle = theme.typography.fontFamily.replace(/"/g, "");

    if (openCases) {
      text.push({
        text: `${openCases} ${i18n.t("dashboard.open")}`,
        fontStyle: `bold ${baseFontStyle}`
      });
    }
    if (closedCases) {
      text.push({
        text: `${closedCases} ${i18n.t("dashboard.closed")}`,
        fontStyle: baseFontStyle
      });
    }

    return text;
  };

  const columns = [
    { label: i18n.t("dashboard.case_worker"), name: "case_worker", id: true },
    { label: i18n.t("dashboard.assessment"), name: "assessment" },
    { label: i18n.t("dashboard.case_plan"), name: "case_plan" },
    { label: i18n.t("dashboard.follow_up"), name: "follow_up" },
    { label: i18n.t("dashboard.services"), name: "services" }
  ];

  const casesChartData = {
    innerTextConfig: getDoughnutInnerText(),
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
    <PageContainer>
      <PageHeading title={i18n.t("navigation.home")} />
      <PageContent>
        <Grid container spacing={3} classes={{ root: css.container }}>
          <Grid item md={12} hidden>
            <OptionsBox title="CASE OVERVIEW">
              <DashboardTable columns={columns} data={casesByCaseWorker} />
            </OptionsBox>
          </Grid>
          <Grid item md={8} xs={12} hidden>
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
            <Services servicesList={servicesStatus} />
          </Grid>
          <Grid item md={4} xs={12} hidden>
            <OptionsBox title={i18n.t("dashboard.flagged")}>
              <FlagList flags={flags} i18n={i18n} />
            </OptionsBox>
          </Grid>
        </Grid>
      </PageContent>
    </PageContainer>
  );
};

Dashboard.displayName = "Dashboard";

Dashboard.propTypes = {
  casesByCaseWorker: PropTypes.object.isRequired,
  casesByStatus: PropTypes.object.isRequired,
  casesOverview: PropTypes.object.isRequired,
  casesRegistration: PropTypes.object.isRequired,
  fetchCasesByCaseWorker: PropTypes.func.isRequired,
  fetchCasesByStatus: PropTypes.func.isRequired,
  fetchCasesOverview: PropTypes.func.isRequired,
  fetchCasesRegistration: PropTypes.func.isRequired,
  fetchFlags: PropTypes.func.isRequired,
  fetchServicesStatus: PropTypes.func.isRequired,
  flags: PropTypes.object.isRequired,
  servicesStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    flags: selectFlags(state),
    casesByStatus: selectCasesByStatus(state),
    casesByCaseWorker: selectCasesByCaseWorker(state),
    casesRegistration: selectCasesRegistration(state),
    casesOverview: selectCasesOverview(state),
    servicesStatus: selectServicesStatus(state)
  };
};

const mapDispatchToProps = {
  fetchFlags: actions.fetchFlags,
  fetchCasesByStatus: actions.fetchCasesByStatus,
  fetchCasesByCaseWorker: actions.fetchCasesByCaseWorker,
  fetchCasesRegistration: actions.fetchCasesRegistration,
  fetchCasesOverview: actions.fetchCasesOverview,
  fetchServicesStatus: actions.fetchServicesStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
