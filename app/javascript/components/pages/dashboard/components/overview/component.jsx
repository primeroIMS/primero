// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import Permission, { RESOURCES, ACTIONS, usePermissions } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { INDICATOR_NAMES, DASHBOARD_TYPES, DASHBOARD_GROUP } from "../../constants";
import { useI18n } from "../../../../i18n";
import {
  getCasesByRiskLevel,
  getGroupOverview,
  getCaseOverview,
  getCaseIncidentOverview,
  getNationalAdminSummary,
  getIsDashboardGroupLoading,
  getDashboardGroupHasData
} from "../../selectors";
import { getOption } from "../../../../record-form";
import { LOOKUPS } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import DashboardColumns from "../../../../dashboard/dashboard-columns";
import { OVERVIEW_DASHBOARD } from "../../../../permissions/constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();

  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.overview));
  const hasData = useMemoizedSelector(state => getDashboardGroupHasData(state, DASHBOARD_GROUP.overview));
  const casesByRiskLevel = useMemoizedSelector(state => getCasesByRiskLevel(state));
  const groupOverview = useMemoizedSelector(state => getGroupOverview(state));
  const caseOverview = useMemoizedSelector(state => getCaseOverview(state));
  const labelsRiskLevel = useMemoizedSelector(state => getOption(state, LOOKUPS.risk_level, i18n.locale));
  const caseIncidentOverview = useMemoizedSelector(state => getCaseIncidentOverview(state));
  const nationalAdminSummary = useMemoizedSelector(state => getNationalAdminSummary(state));
  const canSeeIncidentOverview = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_CASE_INCIDENT_OVERVIEW]);

  const incidentOverviewDashboard = {
    type: DASHBOARD_TYPES.OVERVIEW_BOX,
    actions: ACTIONS.DASH_CASE_INCIDENT_OVERVIEW,
    options: {
      items: caseIncidentOverview,
      highlights: ["new_or_updated", "with_new_incidents"],
      sumTitle: i18n.t("dashboard.dash_case_incident_overview"),
      withTotal: false
    }
  };

  const caseOverviewDashboard = {
    type: DASHBOARD_TYPES.OVERVIEW_BOX,
    actions: ACTIONS.DASH_CASE_OVERVIEW,
    options: {
      items: caseOverview,
      sumTitle: i18n.t("dashboard.case_overview"),
      withTotal: false
    }
  };

  const columns = [
    [
      {
        type: DASHBOARD_TYPES.BADGED_INDICATOR,
        actions: ACTIONS.DASH_CASE_RISK,
        options: {
          data: casesByRiskLevel,
          sectionTitle: i18n.t("dashboard.case_risk"),
          indicator: INDICATOR_NAMES.RISK_LEVEL,
          lookup: labelsRiskLevel
        }
      }
    ],
    [
      canSeeIncidentOverview ? incidentOverviewDashboard : caseOverviewDashboard,
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
        actions: ACTIONS.DASH_NATIONAL_ADMIN_SUMMARY,
        options: {
          items: nationalAdminSummary,
          sumTitle: i18n.t("dashboard.dash_national_admin_summary"),
          withTotal: false
        }
      }
    ]
  ];

  return (
    <Permission resources={RESOURCES.dashboards} actions={OVERVIEW_DASHBOARD}>
      <OptionsBox title={i18n.t("dashboard.overview")} loading={loading} hasData={hasData && !loading}>
        <DashboardColumns columns={columns} />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
