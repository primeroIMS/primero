import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux-immutable";

import { reducer as applicationReducers } from "./components/application";
import { reducer as flaggingReducers } from "./components/flagging";
import { reducer as i18nReducers } from "./components/i18n";
import { reducer as navReducers } from "./components/nav";
import { reducer as notifierReducers } from "./components/notifier";
import { reducer as dashboardReducers } from "./components/pages/dashboard";
import { reducer as exportListReducers } from "./components/pages/export-list";
import { reducer as loginFormReducers } from "./components/pages/login/login-form";
import { reducer as loginReducers } from "./components/pages/login";
import { reducer as recordActionsReducers } from "./components/record-actions";
import { reducer as requestApprovalReducers } from "./components/record-actions/request-approval";
import { reducer as potentialMatchesReducers } from "./components/pages/potential-matches";
import { reducer as reportReducers } from "./components/pages/report";
import { reducer as reportsListReducers } from "./components/pages/reports-list";
import { reducer as supportReducers } from "./components/pages/support";
import { reducer as taskListReducers } from "./components/pages/task-list";
import { reducer as usersListReducers } from "./components/pages/admin/users-list";
import { reducer as usersFormReducers } from "./components/pages/admin/users-form";
import { reducer as userGroupsListReducers } from "./components/pages/admin/user-groups-list";
import { reducer as userGroupsFormReducers } from "./components/pages/admin/user-groups-form";
import { reducer as agenciesListReducers } from "./components/pages/admin/agencies-list";
import { reducer as agenciesFormReducers } from "./components/pages/admin/agencies-form";
import { reducer as contactInformationReducers } from "./components/pages/admin/contact-information";
import { reducer as rolesListReducers } from "./components/pages/admin/roles-list";
import { reducer as rolesFormReducers } from "./components/pages/admin/roles-form";
import { reducer as recordActionsTransitionsReducers } from "./components/record-actions/transitions";
import { reducer as recordFormReducers } from "./components/record-form";
import { reducer as recordsReducers } from "./components/records";
import { reducer as savedSearchesReducers } from "./components/saved-searches";
import { reducer as transitionsReducers } from "./components/transitions";
import { reducer as userReducers } from "./components/user";
import { reducer as indexFiltersReducers } from "./components/index-filters";
import { reducer as transferRequestReducers } from "./components/record-list/view-modal/transfer-request";
import { reducer as transferApprovalReducers } from "./components/transitions/transfers/transfer-approval";
import { reducer as revokeModalReducers } from "./components/transitions/components/revoke-modal";
import { reducer as referralActionReducers } from "./components/transitions/referrals/referral-action";
import { reducer as AuditLogsReducers } from "./components/pages/admin/audit-logs";
import { reducer as lookupsListReducers } from "./components/pages/admin/lookups-list";
import { RECORD_TYPES } from "./config";

const rootReducer = {
  records: reduceReducers(
    combineReducers({
      ...{
        ...Object.keys(RECORD_TYPES).reduce((r, i) => {
          const o = r;

          o[i] = reduceReducers(
            recordsReducers(i),
            indexFiltersReducers(i),
            requestApprovalReducers(i)
          );

          return o;
        }, {})
      },
      reports: reduceReducers(reportsListReducers, reportReducers),
      transitions: reduceReducers(
        recordActionsTransitionsReducers,
        transitionsReducers,
        transferRequestReducers,
        referralActionReducers
      ),
      ...potentialMatchesReducers,
      ...taskListReducers,
      users: reduceReducers(usersListReducers, usersFormReducers),
      agencies: reduceReducers(agenciesListReducers, agenciesFormReducers),
      user_groups: reduceReducers(
        userGroupsListReducers,
        userGroupsFormReducers
      ),
      ...dashboardReducers,
      ...exportListReducers,
      support: reduceReducers(contactInformationReducers, supportReducers),
      ...flaggingReducers,
      ...savedSearchesReducers,
      admin: combineReducers({
        audit_logs: reduceReducers(AuditLogsReducers),
        roles: reduceReducers(rolesListReducers, rolesFormReducers),
        lookups: reduceReducers(lookupsListReducers)
      })
    }),
    transferApprovalReducers,
    revokeModalReducers
  ),
  ui: combineReducers({
    ...navReducers,
    ...i18nReducers,
    ...loginFormReducers,
    ...recordActionsReducers
  }),
  ...userReducers,
  ...recordFormReducers,
  ...notifierReducers,
  ...applicationReducers,
  ...loginReducers
};

export default rootReducer;
