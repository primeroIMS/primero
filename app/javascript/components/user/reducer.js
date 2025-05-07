// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map, fromJS } from "immutable";
import isEmpty from "lodash/isEmpty";

import { mapObjectPropertiesToRecords, mapListToObject } from "../../libs";

import Actions from "./actions";
import { ListHeaderRecord, FilterRecord } from "./records";

const DEFAULT_STATE = Map({
  isAuthenticated: false,
  loaded: false
});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_AUTHENTICATED_USER:
      return state.set("isAuthenticated", true).set("id", payload.id).set("username", payload.username);
    case Actions.LOGOUT_SUCCESS:
      return DEFAULT_STATE;
    case Actions.FETCH_USER_DATA_SUCCESS: {
      const {
        module_unique_ids: modules,
        permissions,
        role_unique_id: roleId,
        role_group_permission: roleGroupPermission,
        list_headers: listHeaders,
        filters,
        permitted_form: permittedForms,
        locale,
        reporting_location_config: reportingLocationConfig,
        location,
        agencyLogo,
        user_group_unique_ids: userGroupUniqueIds,
        user_groups: userGroups,
        agency_id: agencyId,
        agency_unique_id: agencyUniqueId,
        code_of_conduct_id: codeOfConductId,
        code_of_conduct_accepted_on: codeOfConductAcceptedOn,
        permitted_role_unique_ids: permittedRoleUniqueIds,
        managed_report_scope: managedReportScope,
        receive_webpush: receiveWebpush
      } = payload;
      const cleanedPermissions = permissions.list.filter(listItem => !isEmpty(listItem.actions));

      return state.merge(
        fromJS({
          modules,
          permissions: mapListToObject(cleanedPermissions, "resource", "actions"),
          roleId,
          listHeaders: mapObjectPropertiesToRecords(listHeaders, ListHeaderRecord),
          permittedForms,
          filters: mapObjectPropertiesToRecords(filters, FilterRecord),
          locale,
          reportingLocationConfig,
          location,
          agencyLogo,
          roleGroupPermission,
          userGroupUniqueIds,
          userGroups,
          agencyId,
          agencyUniqueId,
          codeOfConductId,
          codeOfConductAcceptedOn,
          permittedRoleUniqueIds,
          managedReportScope,
          loaded: true,
          receiveWebpush
        })
      );
    }
    case Actions.RESET_PASSWORD_STARTED: {
      return state.setIn(["resetPassword", "saving"], true);
    }
    case Actions.RESET_PASSWORD_SUCCESS: {
      return state.setIn(["resetPassword", "saving"], false);
    }
    case Actions.RESET_PASSWORD_FAILURE: {
      return state.setIn(["resetPassword", "saving"], false);
    }
    case Actions.SAVE_USER_NOTIFICATION_SUBSCRIPTION: {
      return state.set("notificationEndpoint", payload);
    }
    case Actions.REMOVE_USER_NOTIFICATION_SUBSCRIPTION: {
      return state.remove("notificationEndpoint", payload);
    }
    default:
      return state;
  }
};
