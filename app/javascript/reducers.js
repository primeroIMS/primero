import reduceReducers from "reduce-reducers";
import { combineReducers } from "redux-immutable";

import { reducers } from "./components/application";
import { reducers as Flagging_reducers } from "./components/flagging";
import { reducers as I18n_reducers } from "./components/i18n";
import { reducers as Nav_reducers } from "./components/nav";
import { reducers as Notifier_reducers } from "./components/notifier";
import { reducers as Dashboard_reducers } from "./components/pages/dashboard";
import { reducers as ExportList_reducers } from "./components/pages/export-list";
import { reducers as loginReducers } from "./components/pages/login/login-form";
import { reducers as idpReducers } from "./components/pages/login";
import { reducers as recordActionsReducers } from "./components/record-actions";
import { reducers as requestApprovalReducers } from "./components/record-actions/request-approval";
import { reducers as PotentialMatches_reducers } from "./components/pages/potential-matches";
import { reducers as Report_reducers } from "./components/pages/report";
import { reducers as Reports_reducers } from "./components/pages/reports-list";
import * as Support from "./components/pages/support";
import * as TaskList from "./components/pages/task-list";
import * as UsersList from "./components/pages/admin/users-list";
import * as UsersForm from "./components/pages/admin/users-form";
import * as UserGroupsList from "./components/pages/admin/user-groups-list";
import * as UserGroupsForm from "./components/pages/admin/user-groups-form";
import * as AgenciesList from "./components/pages/admin/agencies-list";
import * as AgenciesForm from "./components/pages/admin/agencies-form";
import * as ContactInformation from "./components/pages/admin/contact-information";
import * as RolesList from "./components/pages/admin/roles-list";
import * as Transitions from "./components/record-actions/transitions";
import * as RecordForms from "./components/record-form";
import * as Records from "./components/records";
import * as SavedSearches from "./components/saved-searches";
import * as TransitionsForms from "./components/transitions";
import * as User from "./components/user";
import * as IndexFilters from "./components/index-filters";
import * as TransferRequest from "./components/record-list/view-modal/transfer-request";
import { reducer as transferApprovalReducers } from "./components/transitions/transfers/transfer-approval";
import { reducer as revokeTransitionReducers } from "./components/transitions/components/revoke-modal";
import { reducers as referralActionReducers } from "./components/transitions/referrals/referral-action";
import * as AdminLookupsList from "./components/pages/admin/lookups-list";
import { RECORD_TYPES } from "./config";

const rootReducer = {
  records: reduceReducers(
    combineReducers({
      ...{
        ...Object.keys(RECORD_TYPES).reduce((r, i) => {
          const o = r;

          o[i] = reduceReducers(
            Records.reducers(i),
            IndexFilters.reducers(i),
            requestApprovalReducers(i)
          );

          return o;
        }, {})
      },
      reports: reduceReducers(Reports_reducers, Report_reducers),
      transitions: reduceReducers(
        Transitions.reducers,
        TransitionsForms.reducers,
        TransferRequest.reducers,
        referralActionReducers
      ),
      ...PotentialMatches_reducers,
      ...TaskList.reducers,
      users: reduceReducers(UsersList.reducers, UsersForm.reducers),
      agencies: reduceReducers(AgenciesList.reducers, AgenciesForm.reducers),
      roles: reduceReducers(RolesList.reducers),
      user_groups: reduceReducers(
        UserGroupsList.reducers,
        UserGroupsForm.reducers
      ),
      ...Dashboard_reducers,
      ...ExportList_reducers,
      support: reduceReducers(ContactInformation.reducers, Support.reducers),
      ...Flagging_reducers,
      ...SavedSearches.reducers,
      admin: combineReducers({
        lookups: reduceReducers(AdminLookupsList.reducers)
      })
    }),
    transferApprovalReducers,
    revokeTransitionReducers
  ),
  ui: combineReducers({
    ...Nav_reducers,
    ...I18n_reducers,
    ...loginReducers,
    ...recordActionsReducers
  }),
  ...User.reducers,
  ...RecordForms.reducers,
  ...Notifier_reducers,
  ...reducers,
  ...idpReducers
};

export default rootReducer;
