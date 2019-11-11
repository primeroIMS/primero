import React, { useEffect } from "react";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import { connect, batch } from "react-redux";
import { Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import makeStyles from "@material-ui/styles/makeStyles";

import {
  OptionsBox,
  DashboardTable,
  LineChart,
  OverviewBox,
  ActionMenu
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
  selectServicesStatus,
  selectIsOpenPageActions
} from "./selectors";
import styles from "./styles.css";

const Dashboard = ({
  fetchFlags,
  fetchCasesByStatus,
  fetchCasesByCaseWorker,
  fetchCasesRegistration,
  fetchCasesOverview,
  fetchServicesStatus,
  openPageActions,
  flags,
  casesByStatus,
  casesByCaseWorker,
  casesRegistration,
  casesOverview,
  servicesStatus,
  isOpenPageActions
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
    <PageContainer>
      <PageHeading title={i18n.t("navigation.home")}>
        <ActionMenu
          open={isOpenPageActions}
          onOpen={() => openPageActions(true)}
          onClose={() => openPageActions(false)}
          items={actionMenuItems}
        />
      </PageHeading>
      <PageContent>
        <Grid container spacing={3} classes={{ root: css.container }}>
          <Grid item md={12}>
            <OptionsBox
              title="CASE OVERVIEW"
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
              <DashboardTable columns={columns} data={casesByCaseWorker} />
            </OptionsBox>
          </Grid>
          <Grid item md={8} xs={12}>
            <OptionsBox
              title="CASE OVERVIEW"
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
              <OverviewBox items={casesOverview} chartData={casesChartData} />
            </OptionsBox>
            <OptionsBox
              title={i18n.t("dashboard.cases_by_task_overdue")}
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
              <DashboardTable columns={columns} data={casesByCaseWorker} />
            </OptionsBox>
            <OptionsBox
              title={i18n.t("dashboard.registration")}
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
              <LineChart
                chartData={registrationChartData}
                title="Total case registrations over time"
              />
            </OptionsBox>
            <Services servicesList={servicesStatus} />
          </Grid>
          <Grid item md={4} xs={12}>
            <OptionsBox
              title={i18n.t("dashboard.flagged")}
              action={<ActionMenu open={false} items={actionMenuItems} />}
            >
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
  isOpenPageActions: PropTypes.bool.isRequired,
  openPageActions: PropTypes.func.isRequired,
  servicesStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    flags: selectFlags(state),
    casesByStatus: selectCasesByStatus(state),
    casesByCaseWorker: selectCasesByCaseWorker(state),
    casesRegistration: selectCasesRegistration(state),
    casesOverview: selectCasesOverview(state),
    servicesStatus: selectServicesStatus(state),
    isOpenPageActions: selectIsOpenPageActions(state)
  };
};

const mapDispatchToProps = {
  fetchFlags: actions.fetchFlags,
  fetchCasesByStatus: actions.fetchCasesByStatus,
  fetchCasesByCaseWorker: actions.fetchCasesByCaseWorker,
  fetchCasesRegistration: actions.fetchCasesRegistration,
  fetchCasesOverview: actions.fetchCasesOverview,
  fetchServicesStatus: actions.fetchServicesStatus,
  openPageActions: actions.openPageActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
