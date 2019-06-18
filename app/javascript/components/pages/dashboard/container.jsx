import React, { useEffect } from "react";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import {
  OptionsBox,
  DashboardTable,
  LineChart,
  OverviewBox,
  ActionMenu
} from "components/dashboard";
import { FlagList } from "components/dashboard/flag-list";
import { useTheme } from "@material-ui/core/styles";
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
  openPageActions,
  flags,
  casesByStatus,
  casesByCaseWorker,
  casesRegistration,
  casesOverview,
  isOpenPageActions,
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

  const theme = useTheme();

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

  const actionMenuItems = fromJS([
    {
      id: "add-new",
      label: "Add New",
      onClick: () => openPageActions(false)
    },
    {
      id: "arrange-items",
      label: "Arrange Items",
      onClick: () => openPageActions(false)
    },
    {
      id: "refresh-data",
      label: "Refresh Data",
      onClick: () => openPageActions(false)
    }
  ]);

  return (
    <div className={css.root}>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <h1 className={css.Title}>HOME</h1>
        </Grid>
        <Grid item xs={2}>
          <div className={css.PageOptions}>
            <ActionMenu
              open={isOpenPageActions}
              onOpen={() => openPageActions(true)}
              onClose={() => openPageActions(false)}
              items={actionMenuItems}
            />
          </div>
        </Grid>
        <Grid item md={8}>
          <OptionsBox title="CASE OVERVIEW">
            <OverviewBox
              items={casesOverview}
              chartData={casesChartData}
              i18n={i18n}
            />
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
            <FlagList flags={flags} i18n={i18n} />
          </OptionsBox>
        </Grid>
      </Grid>
    </div>
  );
};

Dashboard.propTypes = {
  flags: PropTypes.object.isRequired,
  casesByStatus: PropTypes.object.isRequired,
  casesByCaseWorker: PropTypes.object.isRequired,
  casesRegistration: PropTypes.object.isRequired,
  casesOverview: PropTypes.object.isRequired,
  fetchFlags: PropTypes.func.isRequired,
  fetchCasesByStatus: PropTypes.func.isRequired,
  fetchCasesByCaseWorker: PropTypes.func.isRequired,
  fetchCasesRegistration: PropTypes.func.isRequired,
  fetchCasesOverview: PropTypes.func.isRequired,
  openPageActions: PropTypes.func.isRequired,
  isOpenPageActions: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    flags: selectors.selectFlags(state),
    casesByStatus: selectors.selectCasesByStatus(state),
    casesByCaseWorker: selectors.selectCasesByCaseWorker(state),
    casesRegistration: selectors.selectCasesRegistration(state),
    casesOverview: selectors.selectCasesOverview(state),
    isOpenPageActions: selectors.isOpenPageActions(state)
  };
};

const mapDispatchToProps = {
  fetchFlags: actions.fetchFlags,
  fetchCasesByStatus: actions.fetchCasesByStatus,
  fetchCasesByCaseWorker: actions.fetchCasesByCaseWorker,
  fetchCasesRegistration: actions.fetchCasesRegistration,
  fetchCasesOverview: actions.fetchCasesOverview,
  openPageActions: actions.openPageActions
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
