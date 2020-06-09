import React from "react";
import { withRouter } from "react-router-dom";
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
  AssessmentStatus,
  CompletedCaseSafetyPlan,
  CompletedCaseActionPlan,
  CompletedSupervisorApprovedCaseActionPlan,
  ServicesProvided,
  AverageReferrals,
  AverageFollowupMeetingsPerCase,
  GoalProgressPerNeed,
  TimeFromCaseOpenToClose,
  CaseClosureRate,
  ClientSatisfactionRate,
  ActiveCaseworkers,
  SupervisorToCaseworkerRatio,
  CaseLoad
} from "./components";
import { CommonDateRanges } from "components/key-performance-indicators";
import {common} from "@material-ui/core/colors";

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
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6}>
                  <NumberOfCases 
                    dateRanges={[commonDateRanges.Last3Months]}
                  />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6}>
                  <NumberOfIncidents
                    dateRanges={[commonDateRanges.Last3Months]}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={12}>
                  <ReportingDelay
                    dateRanges={[
                      commonDateRanges.Last3Months,
                      commonDateRanges.Last6Months,
                      commonDateRanges.LastYear
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_assessment')}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <AssessmentStatus
                    dateRanges={[
                      commonDateRanges.AllTime
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_action_planning')}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={6} xl={4}>
                  <CompletedCaseSafetyPlan
                    dateRanges={[
                      commonDateRanges.AllTime
                    ]}
                  />
                </Grid>

                <Grid item className={css.grow} xs={12} md={6} xl={4}>
                  <CompletedCaseActionPlan
                    dateRanges={[
                      commonDateRanges.AllTime
                    ]}
                  />
                </Grid>

                <Grid item className={css.grow} xs={12} xl={4}>
                  <CompletedSupervisorApprovedCaseActionPlan
                    dateRanges={[
                      commonDateRanges.AllTime
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_action_plan_implementation')}</h2>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ServicesProvided
                    dateRanges={[
                      commonDateRanges.AllTime
                    ]}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <AverageReferrals
                    dateRanges={[
                      commonDateRanges.AllTime
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_follow_up')}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={12}>
                  <AverageFollowupMeetingsPerCase
                    dateRanges={[
                      commonDateRanges.Last3Months
                    ]}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <GoalProgressPerNeed
                    dateRanges={[
                      commonDateRanges.AllTime
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.case_closure')}</h2>
              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={12}>
                  <TimeFromCaseOpenToClose
                    dateRanges={[commonDateRanges.AllTime]}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <CaseClosureRate
                    dateRanges={[commonDateRanges.Last3Months]}
                  />
                </Grid>
              </Grid>

            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.feedback')}</h2>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <ClientSatisfactionRate
                    dateRanges={[commonDateRanges.AllTime]}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <h2 className={css.subtitle}>{i18n.t('key_performance_indicators.other')}</h2>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12} md={12}>
                  <SupervisorToCaseworkerRatio 
                    dateRanges={[commonDateRanges.AllTime]}
                  />  
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item className={css.grow} xs={12}>
                  <CaseLoad
                    dateRanges={[commonDateRanges.AllTime]}
                  />
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
