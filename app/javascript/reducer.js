import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux-immutable";

import { reducer as applicationReducer } from "./components/application";
import { reducer as flaggingReducer } from "./components/flagging";
import { reducer as i18nReducer } from "./components/i18n";
import { reducer as navReducer } from "./components/nav";
import { reducer as notifierReducer } from "./components/notifier";
import { reducer as dashboardReducer } from "./components/pages/dashboard";
import { reducer as exportListReducer } from "./components/pages/export-list";
import { reducer as loginFormReducer } from "./components/pages/login/login-form";
import { reducer as loginReducer } from "./components/pages/login";
import { reducer as recordActionsReducer } from "./components/record-actions";
import { reducer as requestApprovalReducer } from "./components/record-actions/request-approval";
import { reducer as bulkTranstionsReducer } from "./components/record-actions/bulk-transtions";
import { reducer as potentialMatchesReducer } from "./components/pages/potential-matches";
import { reducer as reportReducer } from "./components/pages/report";
import { reducer as reportsListReducer } from "./components/pages/reports-list";
import { reducer as supportReducer } from "./components/pages/support";
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
import { RECORD_TYPES } from "./config";

const rootReducer = {
  records: reduceReducers(
    combineReducers({
      ...{
        ...Object.keys(RECORD_TYPES).reduce((r, i) => {
          const o = r;

          o[i] = reduceReducers(
            recordsReducer(i),
            indexFiltersReducer(i),
            requestApprovalReducer(i),
            bulkTranstionsReducer(i)
          );

          return o;
        }, {})
      },
      reports: reduceReducers(reportsListReducer, reportReducer),
      transitions: reduceReducers(
        recordActionsTransitionsReducer,
        transitionsReducer,
        transferRequestReducer,
        referralActionReducer
      ),
      ...potentialMatchesReducer,
      ...taskListReducer,
      users: reduceReducers(usersListReducer, usersFormReducer),
      agencies: reduceReducers(agenciesListReducer, agenciesFormReducer),
      roles: reduceReducers(rolesListReducer),
      user_groups: reduceReducers(userGroupsListReducer, userGroupsFormReducer),
      ...dashboardReducer,
      ...exportListReducer,
      support: reduceReducers(contactInformationReducer, supportReducer),
      ...flaggingReducer,
      ...savedSearchesReducer,
      admin: combineReducers({
        forms: reduceReducers(adminFormListReducer, adminFormBuilderReducer),
        audit_logs: reduceReducers(AuditLogsReducers),
        roles: reduceReducers(rolesListReducer, rolesFormReducer),
        lookups: reduceReducers(lookupsListReducer, AdminLookupsFormReducers)
      })
    }),
    transferApprovalReducer,
    revokeModalReducer
  ),
  ui: combineReducers({
    ...navReducer,
    ...i18nReducer,
    ...loginFormReducer,
    ...recordActionsReducer
  }),
  ...userReducer,
  ...recordFormReducer,
  ...notifierReducer,
  ...applicationReducer,
  ...loginReducer
};

export default rootReducer;
