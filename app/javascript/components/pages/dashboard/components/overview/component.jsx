import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox } from "../../../../dashboard";
import { INDICATOR_NAMES, DASHBOARD_TYPES } from "../../constants";
import { useI18n } from "../../../../i18n";
import { permittedSharedWithMe, dashboardType } from "../../utils";
import {
  getCasesByAssessmentLevel,
  getSharedWithMe,
  getSharedWithOthers,
  getGroupOverview,
  getCaseOverview,
  getCaseIncidentOverview,
  getNationalAdminSummary
} from "../../selectors";
import { getOption } from "../../../../record-form";
import { LOOKUPS } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";

const Component = ({ loadingIndicator, userPermissions }) => {
  const i18n = useI18n();

  const casesByAssessmentLevel = useMemoizedSelector(state => getCasesByAssessmentLevel(state));
  const groupOverview = useMemoizedSelector(state => getGroupOverview(state));
  const caseOverview = useMemoizedSelector(state => getCaseOverview(state));
  const sharedWithMe = useMemoizedSelector(state => getSharedWithMe(state));
  const sharedWithOthers = useMemoizedSelector(state => getSharedWithOthers(state));
  const labelsRiskLevel = useMemoizedSelector(state => getOption(state, LOOKUPS.risk_level, i18n.locale));
  const caseIncidentOverview = useMemoizedSelector(state => getCaseIncidentOverview(state));
  const nationalAdminSummary = useMemoizedSelector(state => getNationalAdminSummary(state));

  const overviewDashHasData = Boolean(
    casesByAssessmentLevel.size ||
      groupOverview.size ||
      caseOverview.size ||
      sharedWithMe.size ||
      sharedWithOthers.size ||
      nationalAdminSummary.size
  );

  const dashboards = [
    {
      type: DASHBOARD_TYPES.BADGED_INDICATOR,
      actions: ACTIONS.DASH_CASE_RISK,
      options: {
        data: casesByAssessmentLevel,
        sectionTitle: i18n.t("dashboard.case_risk"),
        indicator: INDICATOR_NAMES.RISK_LEVEL,
        lookup: labelsRiskLevel
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_CASE_INCIDENT_OVERVIEW,
      options: {
        items: caseIncidentOverview,
        sumTitle: i18n.t("dashboard.dash_case_incident_overview"),
        withTotal: false
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_GROUP_OVERVIEW,
      options: {
        items: groupOverview,
        sumTitle: i18n.t("dashboard.dash_group_overview"),
        withTotal: false
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_CASE_OVERVIEW,
      options: {
        items: caseOverview,
        sumTitle: i18n.t("dashboard.case_overview"),
        withTotal: false
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_NATIONAL_ADMIN_SUMMARY,
      options: {
        items: nationalAdminSummary,
        sumTitle: i18n.t("dashboard.dash_national_admin_summary"),
        withTotal: false
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: [ACTIONS.DASH_SHARED_WITH_ME, ACTIONS.RECEIVE_REFERRAL],
      options: {
        items: permittedSharedWithMe(sharedWithMe, userPermissions),
        sumTitle: i18n.t("dashboard.dash_shared_with_me"),
        withTotal: false
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_SHARED_WITH_OTHERS,
      options: {
        items: sharedWithOthers,
        sumTitle: i18n.t("dashboard.dash_shared_with_others"),
        withTotal: false
      }
    }
  ];

  const renderDashboards = () => {
    return dashboards.map(dashboard => {
      const { type, actions, options } = dashboard;
      const Dashboard = dashboardType(type);

      return (
        <Permission key={actions} resources={RESOURCES.dashboards} actions={actions}>
          <Grid item xs>
            <OptionsBox flat>
              <Dashboard {...options} />
            </OptionsBox>
          </Grid>
        </Permission>
      );
    });
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={dashboards.map(dashboard => dashboard.actions).flat()}>
      <OptionsBox title={i18n.t("dashboard.overview")} hasData={overviewDashHasData || false} {...loadingIndicator}>
        <Grid item md={12}>
          <Grid container>{renderDashboards()}</Grid>
        </Grid>
      </OptionsBox>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object,
  userPermissions: PropTypes.object
};

export default Component;
