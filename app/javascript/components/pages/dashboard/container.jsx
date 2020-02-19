import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, batch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import makeStyles from "@material-ui/styles/makeStyles";

import {
  OptionsBox,
  DashboardTable,
  LineChart,
  OverviewBox,
  BadgedIndicator,
  PieChart
} from "../../dashboard";
import { FlagList } from "../../dashboard/flag-list";
import { Services } from "../../dashboard/services";
import { useI18n } from "../../i18n";
import { PageContainer, PageHeading, PageContent } from "../../page";
import {
  RESOURCES,
  ACTIONS,
  DASH_APPROVALS,
  DASH_APPROVALS_PENDING
} from "../../../libs/permissions";
import Permission from "../../application/permission";
import { LOOKUPS, MODULES, RECORD_TYPES } from "../../../config";
import { selectModule } from "../../application";
import { getOption, getLocations } from "../../record-form";
import { getReportingLocationConfig } from "../../application/selectors";
import { getPermissions } from "../../user/selectors";
import { LoadingIndicator } from "../../loading-indicator";
import { getLoading, getErrors } from "../../index-table";

import NAMESPACE from "./namespace";
import { INDICATOR_NAMES } from "./constants";
import * as actions from "./action-creators";
import {
  getCasesByAssessmentLevel,
  selectFlags,
  selectCasesByStatus,
  selectCasesByCaseWorker,
  selectCasesRegistration,
  selectCasesOverview,
  selectServicesStatus,
  getWorkflowIndividualCases,
  getWorkflowTeamCases,
  getApprovalsAssessment,
  getApprovalsAssessmentPending,
  getApprovalsCasePlan,
  getApprovalsCasePlanPending,
  getApprovalsClosure,
  getApprovalsClosurePending,
  getReportingLocation,
  getProtectionConcerns,
  getCasesByTaskOverdueAssessment,
  getCasesByTaskOverdueCasePlan,
  getCasesByTaskOverdueServices,
  getCasesByTaskOverdueFollowups,
  getSharedWithMe,
  getSharedWithOthers,
  getGroupOverview,
  getCaseOverview
} from "./selectors";
import styles from "./styles.css";
import {
  toData1D,
  toListTable,
  toReportingLocationTable,
  toApprovalsManager,
  toProtectionConcernTable,
  toTasksOverdueTable,
  permittedSharedWithMe,
  taskOverdueHasData
} from "./helpers";

const Dashboard = ({
  fetchFlags,
  fetchCasesByStatus,
  fetchCasesByCaseWorker,
  fetchCasesRegistration,
  fetchCasesOverview,
  fetchServicesStatus,
  getDashboardsData,
  flags,
  casesByAssessmentLevel,
  casesByStatus,
  casesByCaseWorker,
  casesRegistration,
  casesOverview,
  casesWorkflow,
  casesWorkflowTeam,
  reportingLocation,
  servicesStatus,
  approvalsAssessment,
  approvalsCasePlan,
  approvalsClosure,
  reportingLocationConfig,
  locations,
  approvalsAssessmentPending,
  approvalsCasePlanPending,
  approvalsClosurePending,
  protectionConcerns,
  casesByTaskOverdueAssessment,
  casesByTaskOverdueCasePlan,
  casesByTaskOverdueServices,
  casesByTaskOverdueFollowups,
  sharedWithMe,
  userPermissions,
  groupOverview,
  sharedWithOthers,
  caseOverview
}) => {
  useEffect(() => {
    batch(() => {
      fetchFlags();
      fetchCasesByStatus();
      fetchCasesByCaseWorker();
      fetchCasesRegistration();
      fetchCasesOverview();
      fetchServicesStatus();
      getDashboardsData();
    });
  }, [
    fetchCasesByCaseWorker,
    fetchCasesByStatus,
    fetchCasesOverview,
    fetchCasesRegistration,
    fetchFlags,
    fetchServicesStatus,
    getDashboardsData
  ]);

  const css = makeStyles(styles)();

  const theme = useTheme();

  const i18n = useI18n();

  const labelsRiskLevel = useSelector(state =>
    getOption(state, LOOKUPS.risk_level, i18n)
  );

  const protectionConcernsLookup = useSelector(state =>
    getOption(state, LOOKUPS.protection_concerns, i18n.locale)
  );

  const loading = useSelector(state => getLoading(state, NAMESPACE));

  const errors = useSelector(state => getErrors(state, NAMESPACE));

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

  const workflowLabels = useSelector(
    state =>
      selectModule(state, MODULES.CP)?.workflows?.[RECORD_TYPES.cases]?.[
        i18n.locale
      ]
  );

  const casesWorkflowProps = {
    ...toData1D(casesWorkflow, workflowLabels)
  };

  const casesWorkflowTeamProps = {
    ...toListTable(casesWorkflowTeam, workflowLabels),
    loading,
    errors
  };

  const reportingLocationProps = {
    ...toReportingLocationTable(
      reportingLocation,
      reportingLocationConfig?.get("label_key"),
      i18n,
      locations
    ),
    loading,
    errors
  };

  const approvalsManagerProps = {
    items: toApprovalsManager([
      approvalsAssessmentPending,
      approvalsCasePlanPending,
      approvalsClosurePending
    ]),
    sumTitle: i18n.t("dashboard.pending_approvals"),
    withTotal: false,
    loading,
    errors
  };

  const protectionConcernsProps = {
    ...toProtectionConcernTable(
      protectionConcerns,
      i18n,
      protectionConcernsLookup
    ),
    loading,
    errors
  };

  const loadingIndicatorProps = {
    overlay: true,
    type: NAMESPACE,
    loading,
    errors
  };

  const tasksOverdueProps = {
    ...toTasksOverdueTable(
      [
        casesByTaskOverdueAssessment,
        casesByTaskOverdueCasePlan,
        casesByTaskOverdueServices,
        casesByTaskOverdueFollowups
      ],
      i18n
    )
  };

  const loadingIndicatorReportingLocationProps = {
    ...loadingIndicatorProps,
    hasData: Boolean(reportingLocation.size)
  };

  const loadingIndicatorWorkflowProps = {
    ...loadingIndicatorProps,
    hasData: Boolean(casesWorkflow.size)
  };

  const loadingIndicatorWorkflowTeamProps = {
    ...loadingIndicatorProps,
    hasData: Boolean(casesWorkflowTeam.size)
  };

  const loadingIndicatorProtectionConcernsProps = {
    ...loadingIndicatorProps,
    hasData: Boolean(protectionConcerns.size)
  };

  const loadingIndicatoTasksOverdueProps = {
    ...loadingIndicatorProps,
    hasData: taskOverdueHasData(
      casesByTaskOverdueAssessment,
      casesByTaskOverdueCasePlan,
      casesByTaskOverdueServices,
      casesByTaskOverdueFollowups
    )
  };

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.home")} />
      <PageContent>
        <Grid container spacing={3} classes={{ root: css.container }}>
          <Permission resources={RESOURCES.dashboards} actions={DASH_APPROVALS}>
            <Grid item md={12}>
              <OptionsBox title={i18n.t("dashboard.approvals")}>
                <Grid container classes={{ root: css.container }}>
                  <Grid item xs>
                    <Permission
                      resources={RESOURCES.dashboards}
                      actions={DASH_APPROVALS_PENDING}
                    >
                      <OptionsBox flat>
                        <OverviewBox {...approvalsManagerProps} />
                      </OptionsBox>
                    </Permission>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs>
                    <Permission
                      resources={RESOURCES.dashboards}
                      actions={ACTIONS.DASH_APPROVALS_ASSESSMENT}
                    >
                      <OptionsBox flat>
                        <OverviewBox
                          items={approvalsAssessment}
                          sumTitle={i18n.t(approvalsAssessment.get("name"))}
                          loading={loading}
                          errors={errors}
                        />
                      </OptionsBox>
                    </Permission>
                  </Grid>
                  <Grid item xs>
                    <Permission
                      resources={RESOURCES.dashboards}
                      actions={ACTIONS.DASH_APPROVALS_CASE_PLAN}
                    >
                      <OptionsBox flat>
                        <OverviewBox
                          items={approvalsCasePlan}
                          sumTitle={i18n.t(approvalsCasePlan.get("name"))}
                          loading={loading}
                          errors={errors}
                        />
                      </OptionsBox>
                    </Permission>
                  </Grid>
                  <Grid item xs>
                    <Permission
                      resources={RESOURCES.dashboards}
                      actions={ACTIONS.DASH_APPROVALS_CLOSURE}
                    >
                      <OptionsBox flat>
                        <OverviewBox
                          items={approvalsClosure}
                          sumTitle={i18n.t(approvalsClosure.get("name"))}
                          loading={loading}
                          errors={errors}
                        />
                      </OptionsBox>
                    </Permission>
                  </Grid>
                </Grid>
              </OptionsBox>
            </Grid>
          </Permission>
          <Grid item md={6}>
            <OptionsBox title={i18n.t("dashboard.overview")}>
              <Grid item md={12}>
                <Grid container>
                  <Grid item xs>
                    <Permission
                      resources={RESOURCES.dashboards}
                      actions={ACTIONS.DASH_CASE_RISK}
                    >
                      <OptionsBox flat>
                        <BadgedIndicator
                          data={casesByAssessmentLevel}
                          sectionTitle={i18n.t(
                            casesByAssessmentLevel.get("name")
                          )}
                          indicator={INDICATOR_NAMES.RISK_LEVEL}
                          lookup={labelsRiskLevel}
                          loading={loading}
                          errors={errors}
                        />
                      </OptionsBox>
                    </Permission>
                  </Grid>
                  <Permission
                    resources={RESOURCES.dashboards}
                    actions={ACTIONS.DASH_GROUP_OVERVIEW}
                  >
                    <Grid item xs>
                      <OptionsBox flat>
                        <LoadingIndicator
                          type={NAMESPACE}
                          loading={loading}
                          errors={errors}
                          hasData={Boolean(groupOverview.size)}
                          overlay
                        >
                          <OverviewBox
                            items={groupOverview}
                            sumTitle={i18n.t("dashboard.dash_group_overview")}
                            withTotal={false}
                          />
                        </LoadingIndicator>
                      </OptionsBox>
                    </Grid>
                  </Permission>
                  <Permission
                    resources={RESOURCES.dashboards}
                    actions={ACTIONS.DASH_CASE_OVERVIEW}
                  >
                    <Grid item xs>
                      <OptionsBox flat>
                        <LoadingIndicator
                          type={NAMESPACE}
                          loading={loading}
                          errors={errors}
                          hasData={Boolean(caseOverview.size)}
                          overlay
                        >
                          <OverviewBox
                            items={caseOverview}
                            sumTitle={i18n.t("dashboard.case_overview")}
                            withTotal={false}
                          />
                        </LoadingIndicator>
                      </OptionsBox>
                    </Grid>
                  </Permission>
                  <Permission
                    resources={RESOURCES.dashboards}
                    actions={ACTIONS.DASH_SHARED_WITH_ME}
                  >
                    <Grid item xs>
                      <OptionsBox flat>
                        <LoadingIndicator
                          type={NAMESPACE}
                          loading={loading}
                          errors={errors}
                          hasData={Boolean(sharedWithMe.size)}
                          overlay
                        >
                          <OverviewBox
                            items={permittedSharedWithMe(
                              sharedWithMe,
                              userPermissions
                            )}
                            sumTitle={i18n.t("dashboard.dash_shared_with_me")}
                            withTotal={false}
                          />
                        </LoadingIndicator>
                      </OptionsBox>
                    </Grid>
                  </Permission>
                  <Permission
                    resources={RESOURCES.dashboards}
                    actions={ACTIONS.DASH_SHARED_WITH_OTHERS}
                  >
                    <Grid item xs>
                      <OptionsBox flat>
                        <LoadingIndicator
                          type={NAMESPACE}
                          loading={loading}
                          errors={errors}
                          hasData={Boolean(sharedWithOthers.size)}
                          overlay
                        >
                          <OverviewBox
                            items={sharedWithOthers}
                            sumTitle={i18n.t(
                              "dashboard.dash_shared_with_others"
                            )}
                            withTotal={false}
                          />
                        </LoadingIndicator>
                      </OptionsBox>
                    </Grid>
                  </Permission>
                </Grid>
              </Grid>
            </OptionsBox>
          </Grid>
          <Permission
            resources={RESOURCES.dashboards}
            actions={ACTIONS.DASH_WORKFLOW}
          >
            <Grid item md={6}>
              <OptionsBox title={i18n.t("dashboard.workflow")}>
                <LoadingIndicator {...loadingIndicatorWorkflowProps}>
                  <PieChart {...casesWorkflowProps} />
                </LoadingIndicator>
              </OptionsBox>
            </Grid>
          </Permission>

          <Permission
            resources={RESOURCES.dashboards}
            actions={[
              ACTIONS.DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
              ACTIONS.DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
              ACTIONS.DASH_CASES_BY_TASK_OVERDUE_SERVICES,
              ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS
            ]}
          >
            <Grid item md={12}>
              <OptionsBox title={i18n.t("dashboard.cases_by_task_overdue")}>
                <LoadingIndicator {...loadingIndicatoTasksOverdueProps}>
                  <DashboardTable {...tasksOverdueProps} />
                </LoadingIndicator>
              </OptionsBox>
            </Grid>
          </Permission>

          <Permission
            resources={RESOURCES.dashboards}
            actions={ACTIONS.DASH_WORKFLOW_TEAM}
          >
            <Grid item md={12}>
              <OptionsBox title={i18n.t("dashboard.workflow_team")}>
                <LoadingIndicator {...loadingIndicatorWorkflowTeamProps}>
                  <DashboardTable {...casesWorkflowTeamProps} />
                </LoadingIndicator>
              </OptionsBox>
            </Grid>
          </Permission>

          <Permission
            resources={RESOURCES.dashboards}
            actions={ACTIONS.DASH_REPORTING_LOCATION}
          >
            <Grid item md={12}>
              <OptionsBox title={i18n.t("cases.label")}>
                <LoadingIndicator {...loadingIndicatorReportingLocationProps}>
                  <DashboardTable {...reportingLocationProps} />
                </LoadingIndicator>
              </OptionsBox>
            </Grid>
          </Permission>

          <Permission
            resources={RESOURCES.dashboards}
            actions={ACTIONS.DASH_PROTECTION_CONCERNS}
          >
            <Grid item md={12}>
              <OptionsBox title={i18n.t("dashboard.protection_concerns")}>
                <LoadingIndicator {...loadingIndicatorProtectionConcernsProps}>
                  <DashboardTable {...protectionConcernsProps} />
                </LoadingIndicator>
              </OptionsBox>
            </Grid>
          </Permission>
          {/* <Grid item md={12} hidden>
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
          </Grid> */}
        </Grid>
      </PageContent>
    </PageContainer>
  );
};

Dashboard.displayName = "Dashboard";

Dashboard.propTypes = {
  approvalsAssessment: PropTypes.object.isRequired,
  approvalsAssessmentPending: PropTypes.object.isRequired,
  approvalsCasePlan: PropTypes.object.isRequired,
  approvalsCasePlanPending: PropTypes.object.isRequired,
  approvalsClosure: PropTypes.object.isRequired,
  approvalsClosurePending: PropTypes.object.isRequired,
  caseOverview: PropTypes.object.isRequired,
  casesByAssessmentLevel: PropTypes.object.isRequired,
  casesByCaseWorker: PropTypes.object.isRequired,
  casesByStatus: PropTypes.object.isRequired,
  casesByTaskOverdueAssessment: PropTypes.object,
  casesByTaskOverdueCasePlan: PropTypes.object,
  casesByTaskOverdueFollowups: PropTypes.object,
  casesByTaskOverdueServices: PropTypes.object,
  casesOverview: PropTypes.object.isRequired,
  casesRegistration: PropTypes.object.isRequired,
  casesWorkflow: PropTypes.object.isRequired,
  casesWorkflowTeam: PropTypes.object.isRequired,
  fetchCasesByCaseWorker: PropTypes.func.isRequired,
  fetchCasesByStatus: PropTypes.func.isRequired,
  fetchCasesOverview: PropTypes.func.isRequired,
  fetchCasesRegistration: PropTypes.func.isRequired,
  fetchFlags: PropTypes.func.isRequired,
  fetchServicesStatus: PropTypes.func.isRequired,
  flags: PropTypes.object.isRequired,
  getDashboardsData: PropTypes.func.isRequired,
  groupOverview: PropTypes.object.isRequired,
  locations: PropTypes.object,
  openPageActions: PropTypes.func.isRequired,
  protectionConcerns: PropTypes.object.isRequired,
  reportingLocation: PropTypes.object.isRequired,
  reportingLocationConfig: PropTypes.object,
  servicesStatus: PropTypes.object.isRequired,
  sharedWithMe: PropTypes.object.isRequired,
  sharedWithOthers: PropTypes.object.isRequired,
  userPermissions: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    approvalsAssessment: getApprovalsAssessment(state),
    approvalsAssessmentPending: getApprovalsAssessmentPending(state),
    approvalsCasePlan: getApprovalsCasePlan(state),
    approvalsCasePlanPending: getApprovalsClosurePending(state),
    approvalsClosure: getApprovalsClosure(state),
    approvalsClosurePending: getApprovalsCasePlanPending(state),
    casesByAssessmentLevel: getCasesByAssessmentLevel(state),
    casesByCaseWorker: selectCasesByCaseWorker(state),
    casesByStatus: selectCasesByStatus(state),
    casesByTaskOverdueAssessment: getCasesByTaskOverdueAssessment(state),
    casesByTaskOverdueCasePlan: getCasesByTaskOverdueCasePlan(state),
    casesByTaskOverdueFollowups: getCasesByTaskOverdueFollowups(state),
    casesByTaskOverdueServices: getCasesByTaskOverdueServices(state),
    casesOverview: selectCasesOverview(state),
    casesRegistration: selectCasesRegistration(state),
    casesWorkflow: getWorkflowIndividualCases(state),
    casesWorkflowTeam: getWorkflowTeamCases(state),
    flags: selectFlags(state),
    locations: getLocations(state),
    protectionConcerns: getProtectionConcerns(state),
    reportingLocation: getReportingLocation(state),
    reportingLocationConfig: getReportingLocationConfig(state),
    servicesStatus: selectServicesStatus(state),
    sharedWithMe: getSharedWithMe(state),
    userPermissions: getPermissions(state),
    groupOverview: getGroupOverview(state),
    sharedWithOthers: getSharedWithOthers(state),
    caseOverview: getCaseOverview(state)
  };
};

const mapDispatchToProps = {
  fetchFlags: actions.fetchFlags,
  fetchCasesByStatus: actions.fetchCasesByStatus,
  fetchCasesByCaseWorker: actions.fetchCasesByCaseWorker,
  fetchCasesRegistration: actions.fetchCasesRegistration,
  fetchCasesOverview: actions.fetchCasesOverview,
  fetchServicesStatus: actions.fetchServicesStatus,
  getDashboardsData: actions.fetchDashboards,
  openPageActions: actions.openPageActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
