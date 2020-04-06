import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { PageContainer, PageHeading, PageContent } from "components/page";
import {
  Grid,
  Box
} from "@material-ui/core";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import {
  NumberOfCases,
  NumberOfIncidents,
  ReportingDelay,
  ServiceAccessDelay,
  AssessmentStatus,
  CompletedCaseSafetyPlan,
  CompletedCaseActionPlan,
  CompletedSupervisorApprovedCaseActionPlan,
  ServicesProvided,
  AverageReferrals,
  ReferralsPerService,
  CompletedReferralsPerService,
  TotalFollowupMeetings,
  AverageFollowupMeetingsPerCase,
  GoalProgressPerNeed,
  CompletedCaseClosureProcedures,
  TimeFromCaseOpenToClose,
  TimeFromCaseOpenToCloseHighRisk,
  ReasonForCaseClosure,
  CaseClosureRate,
  ClientSatisfactionRate,
  ActiveCaseworkers,
  SupervisorToCaseworkerRatio,
  CaseLoad
} from "./components";
import { CommonDateRanges } from "components/key-performance-indicators";

function KeyPerformanceIndicators({}) {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const commonDateRanges = CommonDateRanges.from(new Date());

  return (
    <div>
      <PageContainer>
        <PageHeading title={i18n.t("key_performance_indicators.label")}></PageHeading>
        <PageContent>
          <Grid>
            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.introduction_and_engagement')}</h2>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <NumberOfCases />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <NumberOfIncidents />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <ReportingDelay />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <ServiceAccessDelay />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_assessment')}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <AssessmentStatus />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_action_planning')}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6} xl={4}>
                  <CompletedCaseSafetyPlan />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6} xl={4}>
                  <CompletedCaseActionPlan />
                </Grid>

                <Grid item className={css.grow} xs={12} xl={4}>
                  <CompletedSupervisorApprovedCaseActionPlan />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_action_plan_implementation')}</h2>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ServicesProvided />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <AverageReferrals />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <ReferralsPerService />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <CompletedReferralsPerService />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_follow_up')}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <TotalFollowupMeetings />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <AverageFollowupMeetingsPerCase />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <GoalProgressPerNeed />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_closure')}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <CompletedCaseClosureProcedures />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <TimeFromCaseOpenToClose
                    dateRanges={[commonDateRanges.Last3Months]}
                  />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <TimeFromCaseOpenToCloseHighRisk />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <ReasonForCaseClosure />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <CaseClosureRate />
                </Grid>
              </Grid>

            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.feedback')}</h2>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <ClientSatisfactionRate />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.other')}</h2>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <ActiveCaseworkers />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <SupervisorToCaseworkerRatio />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <CaseLoad />
                </Grid>
              </Grid>

            </Box>
          </Grid>
        </PageContent>
      </PageContainer>
    </div>
  );
}

export default withRouter(KeyPerformanceIndicators);
