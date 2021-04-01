import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";

import PageContainer, { PageHeading, PageContent } from "../page";
import { useI18n } from "../i18n";

import CommonDateRanges from "./utils/common-date-ranges";
import styles from "./styles.css";
import NumberOfCases from "./components/number-of-cases";
import NumberOfIncidents from "./components/number-of-incidents";
import ReportingDelay from "./components/reporting-delay";
import AssessmentStatus from "./components/assessment-status";
import CompletedCaseSafetyPlan from "./components/completed-case-action-plan";
import CompletedCaseActionPlan from "./components/completed-case-safety-plan";
import CompletedSupervisorApprovedCaseActionPlan from "./components/completed-supervisor-approved-case-action-plan";
import ServicesProvided from "./components/services-provided";
import AverageReferrals from "./components/average-referrals";
import AverageFollowupMeetingsPerCase from "./components/average-followup-meetings-per-case";
import GoalProgressPerNeed from "./components/goal-progress-per-need";
import TimeFromCaseOpenToClose from "./components/time-from-case-open-to-case-close";
import CaseClosureRate from "./components/case-closure-rate";
import ClientSatisfactionRate from "./components/client-satisfaction-rate";
import SupervisorToCaseworkerRatio from "./components/supervisor-to-caseworker-ratio";
import CaseLoad from "./components/case-load";

const useStyles = makeStyles(styles);

const KeyPerformanceIndicators = () => {
  const i18n = useI18n();
  const css = useStyles();
  const commonDateRanges = CommonDateRanges.from(new Date(), i18n);
  const allDateRanges = [
    commonDateRanges.Last3Months,
    commonDateRanges.Last6Months,
    commonDateRanges.LastYear,
    commonDateRanges.AllTime
  ];

  return (
    <div>
      <PageContainer>
        <PageHeading title={i18n.t("key_performance_indicators.label")} />
        <PageContent>
          <Grid>
            <div>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <NumberOfCases dateRanges={allDateRanges} />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <NumberOfIncidents dateRanges={allDateRanges} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={12}>
                  <ReportingDelay
                    dateRanges={allDateRanges}
                  />
                </Grid>
              </Grid>
            </div>

            <div>
              <h2 className={css.subtitle}>{i18n.t("key_performance_indicators.case_assessment")}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <AssessmentStatus dateRanges={allDateRanges} />
                </Grid>
              </Grid>
            </div>

            <div>
              <h2 className={css.subtitle}>{i18n.t("key_performance_indicators.case_action_planning")}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6} xl={4}>
                  <CompletedCaseSafetyPlan dateRanges={allDateRanges} />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6} xl={4}>
                  <CompletedCaseActionPlan dateRanges={allDateRanges} />
                </Grid>

                <Grid item className={css.grow} xs={12} xl={4}>
                  <CompletedSupervisorApprovedCaseActionPlan dateRanges={allDateRanges} />
                </Grid>
              </Grid>
            </div>

            <div>
              <h2 className={css.subtitle}>{i18n.t("key_performance_indicators.case_action_plan_implementation")}</h2>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ServicesProvided dateRanges={allDateRanges} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <AverageReferrals dateRanges={allDateRanges} />
                </Grid>
              </Grid>
            </div>

            <div>
              <h2 className={css.subtitle}>{i18n.t("key_performance_indicators.case_follow_up")}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={12}>
                  <AverageFollowupMeetingsPerCase dateRanges={allDateRanges} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <GoalProgressPerNeed dateRanges={allDateRanges} />
                </Grid>
              </Grid>
            </div>

            <div>
              <h2 className={css.subtitle}>{i18n.t("key_performance_indicators.case_closure")}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={12}>
                  <TimeFromCaseOpenToClose dateRanges={allDateRanges} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <CaseClosureRate dateRanges={allDateRanges} />
                </Grid>
              </Grid>
            </div>

            <div>
              <h2 className={css.subtitle}>{i18n.t("key_performance_indicators.feedback")}</h2>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <ClientSatisfactionRate dateRanges={allDateRanges} />
                </Grid>
              </Grid>
            </div>

            <div>
              <h2 className={css.subtitle}>{i18n.t("key_performance_indicators.other")}</h2>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={12}>
                  <SupervisorToCaseworkerRatio dateRanges={allDateRanges} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <CaseLoad dateRanges={allDateRanges} />
                </Grid>
              </Grid>
            </div>
          </Grid>
        </PageContent>
      </PageContainer>
    </div>
  );
};

KeyPerformanceIndicators.displayName = "KeyPerformanceIndicators";

export default withRouter(KeyPerformanceIndicators);
