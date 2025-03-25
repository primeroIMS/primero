// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux-immutable";

import { reducer as applicationReducer } from "./components/application";
import { reducer as flaggingReducer } from "./components/flagging";
import { reducer as i18nReducer } from "./components/i18n";
import { reducer as navReducer } from "./components/nav";
import { reducer as notifierReducer } from "./components/notifier";
import { reducer as dashboardReducer } from "./components/pages/dashboard";
import { reducer as exportListReducer } from "./components/pages/export-list";
import { reducer as loginFormReducer } from "./components/login/components/login-form";
import { reducer as loginReducer } from "./components/login";
import { reducer as dialogReducer } from "./components/action-dialog";
import { reducer as requestApprovalReducer } from "./components/record-actions/request-approval";
import { reducer as bulkTranstionsReducer } from "./components/record-actions/bulk-transtions";
import { reducer as potentialMatchesReducer } from "./components/pages/potential-matches";
import { reducer as reportReducer } from "./components/report";
import { reducer as reportsListReducer } from "./components/reports-list";
import { reducer as insightsListReducer } from "./components/insights-list";
import { reducer as insightsSubReportReducer } from "./components/insights-sub-report";
import { reducer as reportFormReducer } from "./components/reports-form";
import { reducer as supportReducer } from "./components/contact-information";
import { reducer as taskListReducer } from "./components/pages/task-list";
import { reducer as usersListReducer } from "./components/pages/admin/users-list";
import { reducer as usersFormReducer } from "./components/pages/admin/users-form";
import { reducer as userGroupsListReducer } from "./components/pages/admin/user-groups-list";
import { reducer as userGroupsFormReducer } from "./components/pages/admin/user-groups-form";
import { reducer as agenciesListReducer } from "./components/pages/admin/agencies-list";
import { reducer as agenciesFormReducer } from "./components/pages/admin/agencies-form";
import { reducer as contactInformationReducer } from "./components/pages/admin/contact-information";
import { reducer as rolesListReducer } from "./components/pages/admin/roles-list";
import { reducer as rolesFormReducer } from "./components/pages/admin/roles-form";
import { reducer as recordActionsTransitionsReducer } from "./components/record-actions/transitions";
import { reducer as recordFormReducer } from "./components/record-form";
import { reducer as recordsReducer } from "./components/records";
import { reducer as savedSearchesReducer } from "./components/saved-searches";
import { reducer as transitionsReducer } from "./components/transitions";
import { reducer as userReducer } from "./components/user";
import { reducer as indexFiltersReducer } from "./components/index-filters";
import { reducer as transferRequestReducer } from "./components/record-list/view-modal/transfer-request";
import { reducer as transferApprovalReducer } from "./components/transitions/transfers/transfer-approval";
import { reducer as revokeModalReducer } from "./components/transitions/components/revoke-modal";
import { reducer as referralActionReducer } from "./components/transitions/referrals/referral-action";
import { reducer as lookupsListReducer } from "./components/pages/admin/lookups-list";
import { reducer as AdminLookupsFormReducers } from "./components/pages/admin/lookups-form";
import { reducer as adminFormListReducer } from "./components/pages/admin/forms-list";
import { reducer as adminFormBuilderReducer } from "./components/pages/admin/form-builder";
import { reducer as AuditLogsReducers } from "./components/pages/admin/audit-logs";
import { reducer as UsageReportsReducer } from "./components/pages/admin/usage-reports";
import { reducer as kpiReducer } from "./components/key-performance-indicators";
import { reducer as configurationsListReducer } from "./components/pages/admin/configurations-list";
import { reducer as configurationsFormReducer } from "./components/pages/admin/configurations-form";
import { reducer as activityLogReducer } from "./components/activity-log";
import {
  reducer as locationsListReducer,
  importReducer as locationsImportReducer
} from "./components/pages/admin/locations-list";
import { reducer as accountReducer } from "./components/pages/account";
import { reducer as connectivityReducer } from "./components/connectivity";
import { reducer as changeLogsReducers } from "./components/change-logs";
import { reducer as codesOfConductReducer } from "./components/code-of-conduct";
import { reducer as adminCodeOfConductReducer } from "./components/pages/admin/code-of-conduct";
import { reducer as drawerReducer } from "./components/drawer";
import { reducer as formFiltersReducer } from "./components/form-filters";
import { reducer as insightsReducer } from "./components/insights";
import { RECORD_TYPES } from "./config";

const initialState = null;

const rootReducer = {
  records: reduceReducers(
    initialState,
    combineReducers({
      ...{
        ...Object.keys(RECORD_TYPES).reduce((r, i) => {
          const o = r;

          o[i] = reduceReducers(
            initialState,
            recordsReducer(i),
            indexFiltersReducer(i),
            requestApprovalReducer(i),
            bulkTranstionsReducer(i)
          );

          return o;
        }, {})
      },
      reports: reduceReducers(initialState, reportsListReducer, reportReducer, reportFormReducer),
      insights: reduceReducers(initialState, insightsListReducer, insightsReducer, insightsSubReportReducer),
      transitions: reduceReducers(
        initialState,
        recordActionsTransitionsReducer,
        transitionsReducer,
        transferRequestReducer,
        referralActionReducer
      ),
      ...potentialMatchesReducer,
      ...taskListReducer,
      users: reduceReducers(initialState, usersListReducer, usersFormReducer),
      agencies: reduceReducers(initialState, agenciesListReducer, agenciesFormReducer),
      roles: reduceReducers(initialState, rolesListReducer),
      user_groups: reduceReducers(initialState, userGroupsListReducer, userGroupsFormReducer),
      ...dashboardReducer,
      ...exportListReducer,
      support: reduceReducers(initialState, contactInformationReducer, supportReducer),
      ...flaggingReducer,
      ...savedSearchesReducer,
      ...changeLogsReducers,
      codeOfConduct: adminCodeOfConductReducer,
      admin: combineReducers({
        forms: reduceReducers(initialState, adminFormListReducer, adminFormBuilderReducer),
        audit_logs: reduceReducers(initialState, AuditLogsReducers),
        roles: reduceReducers(initialState, rolesListReducer, rolesFormReducer),
        lookups: reduceReducers(initialState, lookupsListReducer, AdminLookupsFormReducers),
        configurations: reduceReducers(initialState, configurationsListReducer, configurationsFormReducer),
        locations: reduceReducers(initialState, locationsListReducer, locationsImportReducer),
        usage_reports: reduceReducers(initialState, UsageReportsReducer)
      }),
      activity_logs: activityLogReducer,
      ...kpiReducer
    }),
    transferApprovalReducer,
    revokeModalReducer
  ),
  user: reduceReducers(initialState, userReducer, accountReducer, codesOfConductReducer),
  ui: combineReducers({
    ...navReducer,
    ...i18nReducer,
    ...loginFormReducer,
    ...dialogReducer,
    ...drawerReducer,
    ...formFiltersReducer
  }),
  ...recordFormReducer,
  ...notifierReducer,
  ...applicationReducer,
  ...loginReducer,
  ...connectivityReducer
};

export default rootReducer;
