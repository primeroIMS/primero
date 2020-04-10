import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux-immutable";

import { reducers as applicationReducers } from "./components/application";
import { reducers as flaggingReducers } from "./components/flagging";
import { reducers as i18nReducers } from "./components/i18n";
import { reducers as navReducers } from "./components/nav";
import { reducers as notifierReducers } from "./components/notifier";
import { reducers as dashboardReducers } from "./components/pages/dashboard";
import { reducers as exportListReducers } from "./components/pages/export-list";
import { reducers as loginFormReducers } from "./components/pages/login/login-form";
import { reducers as loginReducers } from "./components/pages/login";
import { reducers as recordActionsReducers } from "./components/record-actions";
import { reducers as requestApprovalReducers } from "./components/record-actions/request-approval";
import { reducers as potentialMatchesReducers } from "./components/pages/potential-matches";
import { reducers as reportReducers } from "./components/pages/report";
import { reducers as reportsListReducers } from "./components/pages/reports-list";
import { reducers as supportReducers } from "./components/pages/support";
import { reducers as taskListReducers } from "./components/pages/task-list";
import { reducers as usersListReducers } from "./components/pages/admin/users-list";
import { reducers as usersFormReducers } from "./components/pages/admin/users-form";
import { reducers as userGroupsListReducers } from "./components/pages/admin/user-groups-list";
import { reducers as userGroupsFormReducers } from "./components/pages/admin/user-groups-form";
import { reducers as agenciesListReducers } from "./components/pages/admin/agencies-list";
import { reducers as agenciesFormReducers } from "./components/pages/admin/agencies-form";
import { reducers as contactInformationReducers } from "./components/pages/admin/contact-information";
import { reducers as rolesListReducers } from "./components/pages/admin/roles-list";
import { reducers as rolesFormReducers } from "./components/pages/admin/roles-form";
import { reducers as recordActionsTransitionsReducers } from "./components/record-actions/transitions";
import { reducers as recordFormReducers } from "./components/record-form";
import { reducers as recordsReducers } from "./components/records";
import { reducers as savedSearchesReducers } from "./components/saved-searches";
import { reducers as transitionsReducers } from "./components/transitions";
import { reducers as userReducers } from "./components/user";
import { reducers as indexFiltersReducers } from "./components/index-filters";
import { reducers as transferRequestReducers } from "./components/record-list/view-modal/transfer-request";
import { reducers as transferApprovalReducers } from "./components/transitions/transfers/transfer-approval";
import { reducers as revokeModalReducers } from "./components/transitions/components/revoke-modal";
import { reducers as referralActionReducers } from "./components/transitions/referrals/referral-action";
import { reducers as adminFormListReducers } from "./components/pages/admin/forms/forms-list/reducers";
import { reducers as lookupsListReducers } from "./components/pages/admin/lookups-list";
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
        ...adminFormListReducers,
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
