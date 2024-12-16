// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, List } from "immutable";
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";
import { createCachedSelector } from "re-reselect";
import { createSelectorCreator, defaultMemoize } from "reselect";
import { memoize } from "proxy-memoize";

import { RECORD_PATH } from "../../config";
import {
  getIncidentReportingLocationConfig,
  getReportingLocationConfig,
  getRoles,
  getUserGroups
} from "../application/selectors";
import { displayNameHelper } from "../../libs";
import {
  getAssignedAgency,
  getCurrentUserGroupPermission,
  getCurrentUserGroupsUniqueIds,
  getCurrentUserUserGroups,
  getIsManagedReportScopeAll,
  getPermittedRoleUniqueIds
} from "../user/selectors";
import { getRecordForms, getFieldByName } from "../record-form/selectors";
import { GROUP_PERMISSIONS } from "../permissions";
import { getLocale } from "../i18n/selectors";
import { getSelectedRecordData } from "../records";
import { CP_VIOLENCE_TYPE } from "../incidents-from-case/components/panel/constants";
import { selectorEqualityFn } from "../../libs/use-memoized-selector";

import { OPTION_TYPES, CUSTOM_LOOKUPS } from "./constants";
import { buildLinkedIncidentOptions, buildRoleOptions } from "./utils";

// TODO: Move to useMemoizedSelector
const defaultCacheSelectorOptions = {
  keySelector: (_state, options) => JSON.stringify(omitBy(options, isNil)),
  selectorCreator: createSelectorCreator(defaultMemoize, selectorEqualityFn)
};

const lookupsList = memoize(state => state.getIn(["forms", "options", "lookups"], fromJS([])));
const moduleList = state => state.getIn(["application", "modules"], fromJS([]));
const formSectionList = state => state.getIn(["records", "admin", "forms", "formSections"], fromJS([]));
const referralUserList = state => state.getIn(["records", "transitions", "referral", "users"], fromJS([]));
const transferUserList = state => state.getIn(["records", "transitions", "transfer", "users"], fromJS([]));
const managedRoleList = state => state.getIn(["application", "managedRoles"], fromJS([]));
const referralAuthorizationRoleList = state =>
  state.getIn(["application", "referralAuthorizationRoles", "data"], fromJS([]));
const agencyList = memoize(state => state.getIn(["application", "agencies"], fromJS([])));

const formGroups = createCachedSelector(getLocale, formSectionList, (locale, data) => {
  const formGroupsObj = data
    .filter(formSection => !formSection.is_nested && formSection.form_group_id)
    .groupBy(item => item.get("form_group_id"))
    .reduce(
      (prev, current) => [
        ...prev,
        {
          id: current.first().getIn(["form_group_id"], null),
          display_text: current.first().getIn(["form_group_name", locale], "")
        }
      ],
      []
    );

  return sortBy(formGroupsObj, item => item.display_text);
})(defaultCacheSelectorOptions);

const referToUsers = createCachedSelector(
  referralUserList,
  (_state, options) => options,
  (data, options) => {
    const { currRecord, fullUsers = false } = options;

    return data
      ?.reduce((prev, current) => {
        const userName = current.get("user_name");

        if (!isEmpty(currRecord)) {
          const currUser = currRecord;

          if (currUser && currUser === userName) {
            return [...prev];
          }
        }

        return [
          ...prev,
          {
            id: userName.toLowerCase(),
            display_text: userName,
            ...(fullUsers && { agency: current.get("agency"), location: current.get("location") })
          }
        ];
      }, [])
      ?.filter(user => !isEmpty(user));
  }
)(defaultCacheSelectorOptions);

const transferToUsers = createCachedSelector(
  transferUserList,
  (_state, options) => options,
  (data, options) => {
    const { currRecord, fullUsers = false } = options;

    return data
      ?.reduce((prev, current) => {
        const userName = current.get("user_name");

        if (!isEmpty(currRecord)) {
          const currUser = currRecord;

          if (currUser && currUser === userName) {
            return [...prev];
          }
        }

        return [
          ...prev,
          {
            id: userName.toLowerCase(),
            display_text: userName,
            ...(fullUsers && { agency: current.get("agency"), location: current.get("location") })
          }
        ];
      }, [])
      ?.filter(user => !isEmpty(user));
  }
)(defaultCacheSelectorOptions);

const agenciesParser = (data, { useUniqueId, optionStringsSourceIdKey, locale, filterOptions, includeServices }) => {
  const filteredAgencies = filterOptions ? filterOptions(data) : data;

  return filteredAgencies.reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get(useUniqueId ? "unique_id" : optionStringsSourceIdKey || "id"),
        display_text: current.getIn(["name", locale], ""),
        disabled: current.get("disabled", false),
        ...(includeServices && { services: current.get("services", fromJS([])).toArray() })
      }
    ],
    []
  );
};

const agencies = createCachedSelector(
  getLocale,
  agencyList,
  (_state, options) => options,
  (locale, data, options) => {
    return agenciesParser(data, { ...options, locale });
  }
)(defaultCacheSelectorOptions);

const agenciesCurrentUser = createCachedSelector(
  getLocale,
  agencyList,
  getAssignedAgency,
  (_state, options) => options,
  (locale, data, currentUserAgencyData, options) => {
    const currentUserAgency = fromJS([currentUserAgencyData]);
    const allAgencies = agenciesParser(data, { ...options, locale });

    return allAgencies.map(agency => ({
      ...agency,
      disabled: agency.disabled || !currentUserAgency.includes(agency.id)
    }));
  }
)(defaultCacheSelectorOptions);

const locationList = memoize(state => state.getIn(["forms", "options", "locations"], fromJS([])));

const getLocationName = (location, { adminLevel, locale, usePlacename = true }) => {
  const locationName = displayNameHelper(location.get("name"), locale);

  if (adminLevel && usePlacename) {
    const splittedName = locationName.includes("::") ? locationName.split("::") : locationName.split(":");

    return splittedName[adminLevel] || locationName;
  }

  return locationName;
};

const locationsParser = (data, { includeAdminLevel, locale, adminLevel, usePlacename }) => {
  return data.reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get("code"),
        display_text: getLocationName(current, { adminLevel, locale, usePlacename }),
        disabled: current.get("disabled"),
        ...(includeAdminLevel && { admin_level: current.get("admin_level") })
      }
    ],
    []
  );
};

const locations = memoize(([state, options]) => {
  const locale = getLocale(state);
  const data = locationList(state);

  const reportingLocationData = options?.useIncidentReportingLocationConfig
    ? getIncidentReportingLocationConfig(state)
    : getReportingLocationConfig(state);

  return locationsParser(data, {
    ...options,
    locale,
    adminLevel: options?.useReportingLocationName && (options.level || reportingLocationData?.get("admin_level"))
  });
});

// REFACTOR: This and the selector above could actually be a single selector.
const reportingLocations = memoize(([state, options]) => {
  const locale = getLocale(state);
  const data = locationList(state);
  const reportingLocationData = options?.useIncidentReportingLocationConfig
    ? getIncidentReportingLocationConfig(state)
    : getReportingLocationConfig(state);

  return locationsParser(
    data.filter(location =>
      options.includeChildren === true
        ? location.get("admin_level") >= reportingLocationData.get("admin_level")
        : location.get("admin_level") === reportingLocationData.get("admin_level")
    ),
    {
      ...options,
      includeAdminLevel: true,
      locale,
      adminLevel: reportingLocationData?.get("admin_level")
    }
  );
});

const modules = createCachedSelector(moduleList, data => {
  return data.reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get("unique_id"),
        display_text: current.get("name")
      }
    ],
    []
  );
})(defaultCacheSelectorOptions);

const lookupValues = createCachedSelector(
  getLocale,
  lookupsList,
  (_state, options) => options,
  (locale, data, options) => {
    const { fullLookup, source } = options;

    if (List.isList(source)) {
      return [];
    }

    const lookup = data.find(option => option.get("unique_id") === source.replace(/lookup /, ""), null, fromJS({}));

    if (fullLookup) {
      return lookup;
    }

    return lookup.get("values", fromJS([])).reduce(
      (prev, current) => [
        ...prev,
        {
          id: current.get("id"),
          display_text: displayNameHelper(current.get("display_text"), locale),
          disabled: current.get("disabled", false),
          ...(current.get("tags")?.size
            ? { tags: current.get("tags").reduce((acc, elem) => acc.concat(elem), []) }
            : {})
        }
      ],
      []
    );
  }
)(defaultCacheSelectorOptions);

const filterableOptions = (filterOptions, data) => (filterOptions ? filterOptions(data) : data);

const lookups = createCachedSelector(
  getLocale,
  lookupsList,
  (_state, options) => options,
  (locale, data, options) => {
    const { filterOptions } = options;
    const lookupList = [
      ...data.reduce(
        (prev, current) => [
          ...prev,
          {
            id: `lookup ${current.get("unique_id")}`,
            display_text: current.getIn(["name", locale]),
            values: current.get("values", fromJS([])).reduce(
              (valPrev, valCurrent) => [
                ...valPrev,
                {
                  id: valCurrent.get("id"),
                  display_text: valCurrent.getIn(["display_text", locale])
                }
              ],
              []
            )
          }
        ],
        []
      ),
      ...(!filterOptions
        ? sortBy(
            CUSTOM_LOOKUPS.map(custom => ({
              id: custom,
              display_text: `${custom.toLowerCase()}.label`,
              translate: true
            })),
            lookup => lookup.display_text
          )
        : [])
    ];

    return filterableOptions(filterOptions, lookupList);
  }
)(defaultCacheSelectorOptions);

const userGroupsParser = (data, options) => {
  const { filterOptions } = options;
  const applicationUserGroups = data.reduce(
    (prev, current) => [
      ...prev,
      { id: current.get("unique_id"), display_text: current.get("name"), disabled: current.get("disabled", false) }
    ],
    []
  );

  if (filterOptions) {
    return filterableOptions(filterOptions, applicationUserGroups);
  }

  return applicationUserGroups;
};

const userGroups = createCachedSelector(
  getUserGroups,
  (_state, options) => options,
  (data, options) => {
    return userGroupsParser(data, options);
  }
)(defaultCacheSelectorOptions);

const userGroupsPermitted = (isInsights = false) =>
  createCachedSelector(
    getUserGroups,
    getCurrentUserUserGroups,
    getCurrentUserGroupsUniqueIds,
    getCurrentUserGroupPermission,
    isInsights ? getIsManagedReportScopeAll : () => false,
    (_state, options) => options,
    (data, currentUserGroups, currentUserGroupIds, currentRoleGroupPermission, isManagedReportScopeAll, options) => {
      const allUserGroups = userGroupsParser(data, options);
      const currentUserGroupOptions = userGroupsParser(currentUserGroups, options);

      if (isEmpty(allUserGroups)) {
        return currentUserGroupOptions;
      }

      if (currentRoleGroupPermission === GROUP_PERMISSIONS.ALL || (isInsights && isManagedReportScopeAll)) {
        return allUserGroups;
      }

      return allUserGroups.map(userGroup => {
        if (currentUserGroupIds.includes(userGroup.id)) {
          return userGroup;
        }

        return { ...userGroup, disabled: true };
      });
    }
  )(defaultCacheSelectorOptions);

const formGroupLookup = createCachedSelector(
  getLocale,
  lookupsList,
  (_state, options) => options,
  (appLocale, data, options) => {
    const { filterOptions } = options;

    return filterableOptions(
      filterOptions,
      data
        .filter(lookup => lookup.get("unique_id").startsWith("lookup-form-group-"))
        .reduce(
          (prev, current) => [
            ...prev,
            {
              unique_id: current.get("unique_id"),
              name: current
                .get("name", fromJS({}))
                .entrySeq()
                .reduce((namePrev, [locale, value]) => ({ ...namePrev, [locale]: value }), {}),
              values: current.get("values", fromJS([])).reduce(
                (valPrev, valCurrent) => [
                  ...valPrev,
                  {
                    id: valCurrent.get("id"),
                    display_text: valCurrent.getIn(["display_text", appLocale])
                  }
                ],
                []
              )
            }
          ],
          []
        )
    );
  }
)(defaultCacheSelectorOptions);

const recordForms = createCachedSelector(
  state => getRecordForms(state, { all: true }),
  (_state, options) => options,
  (data, options) => {
    const { filterOptions } = options;

    return filterOptions ? filterableOptions(filterOptions, data) : data;
  }
)(defaultCacheSelectorOptions);

const roles = createCachedSelector(getRoles, data => {
  return buildRoleOptions(data);
})(defaultCacheSelectorOptions);

const manageRolesParser = (data, transfer) => (transfer ? data.filter(role => role.get(transfer, false)) : data);

const managedRoleFormSections = createCachedSelector(
  managedRoleList,
  (_state, options) => options,
  (data, options) => {
    const { uniqueID } = options;
    const selectedRole = manageRolesParser(data)?.find(role => role.get("unique_id") === uniqueID, null, fromJS({}));

    return selectedRole.get("form_section_read_write", fromJS({})).keySeq().toList();
  }
)(defaultCacheSelectorOptions);

const buildManagedRoles = createCachedSelector(managedRoleList, data => {
  return manageRolesParser(data, "referral").reduce(
    (prev, current) => [...prev, { id: current.get("unique_id"), display_text: current.get("name") }],
    []
  );
})(defaultCacheSelectorOptions);

const buildReferralAuthorizationRoles = createCachedSelector(referralAuthorizationRoleList, data => {
  return data.reduce(
    (prev, current) => [...prev, { id: current.get("unique_id"), display_text: current.get("name") }],
    []
  );
})(defaultCacheSelectorOptions);

const buildPermittedRoles = createCachedSelector(
  getRoles,
  getPermittedRoleUniqueIds,
  (data, permittedRoleUniqueIds) => {
    const permittedRoles = permittedRoleUniqueIds?.isEmpty()
      ? data
      : data.map(role =>
          role.set("disabled", role.get("disabled") || !permittedRoleUniqueIds.includes(role.get("unique_id")))
        );

    return buildRoleOptions(permittedRoles);
  }
)(defaultCacheSelectorOptions);

const linkedIncidents = createCachedSelector(
  state => getSelectedRecordData(state, RECORD_PATH.cases),
  state => {
    // eslint-disable-next-line camelcase
    const source = getFieldByName(state, CP_VIOLENCE_TYPE)?.option_strings_source;

    if (!source) {
      return [];
    }

    return lookupValues(state, { source });
  },
  (_state, options) => options,
  (data, violenceLookupValues, options) =>
    buildLinkedIncidentOptions(data.get("incident_details", fromJS([])), violenceLookupValues, options)
)(defaultCacheSelectorOptions);

export const getOptions = source => {
  switch (source) {
    case OPTION_TYPES.AGENCY:
      return agencies;
    case OPTION_TYPES.AGENCY_CURRENT_USER:
      return agenciesCurrentUser;
    case OPTION_TYPES.LOCATION:
      return locations;
    case OPTION_TYPES.REPORTING_LOCATIONS:
      return reportingLocations;
    case OPTION_TYPES.MODULE:
      return modules;
    case OPTION_TYPES.FORM_GROUP:
      return formGroups;
    case OPTION_TYPES.LOOKUPS:
      return lookups;
    case OPTION_TYPES.REFER_TO_USERS:
      return referToUsers;
    case OPTION_TYPES.USER_GROUP:
      return userGroups;
    case OPTION_TYPES.USER_GROUP_PERMITTED:
      return userGroupsPermitted();
    case OPTION_TYPES.INSIGHTS_USER_GROUP_PERMITTED:
      return userGroupsPermitted(true);
    case OPTION_TYPES.ROLE:
      return roles;
    case OPTION_TYPES.ROLE_EXTERNAL_REFERRAL:
      return buildManagedRoles;
    case OPTION_TYPES.ROLE_REFERRAL_AUTHORIZATION:
      return buildReferralAuthorizationRoles;
    case OPTION_TYPES.ROLE_PERMITTED:
      return buildPermittedRoles;
    case OPTION_TYPES.FORM_GROUP_LOOKUP:
      return formGroupLookup;
    case OPTION_TYPES.RECORD_FORMS:
      return recordForms;
    case OPTION_TYPES.MANAGED_ROLE_FORM_SECTIONS:
      return managedRoleFormSections;
    case OPTION_TYPES.TRANSFER_TO_USERS:
      return transferToUsers;
    case OPTION_TYPES.LINKED_INCIDENTS:
      return linkedIncidents;
    default:
      return lookupValues;
  }
};

export const getLoadingState = (state, path) => (path ? state.getIn(path, false) : false);

export const getValueFromOtherField = (state, fields, values) => {
  if (isEmpty(values)) {
    return [];
  }

  return fields.reduce((prev, current) => {
    const value = state
      .getIn(current.path, fromJS([]))
      .find(elem => elem.get(current.filterKey) === values[current.valueKey], fromJS({}))
      ?.get(current.key, "");

    if (current.optionStringSource && current.setWhenEnabledInSource) {
      const isLocationSource = [OPTION_TYPES.LOCATION, OPTION_TYPES.REPORTING_LOCATIONS].includes(
        current.optionStringSource
      );
      const options = isLocationSource
        ? getOptions(current.optionStringSource)([state, { source: current.optionStringSource, useUniqueId: true }])
        : getOptions(current.optionStringSource)(state, { source: current.optionStringSource, useUniqueId: true });
      const selectedOption = options.find(option => option.id === value);

      if (selectedOption && !selectedOption.disabled) {
        prev.push([current.field, value]);
      }
    } else {
      prev.push([current.field, value]);
    }

    return prev;
  }, []);
};

export const getLookupsByIDs = (state, ids) => {
  if (!ids) {
    return fromJS([]);
  }

  return state
    .getIn(["forms", "options", "lookups"], fromJS([]))
    .filter(lookup => ids.map(keys => keys.replace("lookup ", "")).includes(lookup.get("unique_id")), fromJS([]));
};
