import { fromJS, isImmutable } from "immutable";
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import { createCachedSelector } from "re-reselect";

import { getReportingLocationConfig, getRoles, getUserGroups } from "../application/selectors";
import { displayNameHelper } from "../../libs";
import {
  getAssignedAgency,
  getCurrentUserGroupPermission,
  getCurrentUserGroupsUniqueIds,
  getPermittedRoleUniqueIds
} from "../user/selectors";
import { getRecordForms } from "../record-form";
import { GROUP_PERMISSIONS } from "../../libs/permissions";

import { OPTION_TYPES, CUSTOM_LOOKUPS } from "./constants";
import { get, buildRoleOptions } from "./utils";

const referToUsers = (state, { currRecord, fullUsers = false }) =>
  state
    .getIn(["records", "transitions", "referral", "users"], fromJS([]))
    ?.reduce((prev, current) => {
      const userName = current.get("user_name");

      if (!isEmpty(currRecord)) {
        const currUser = currRecord.get("owned_by");

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

const lookupsList = state => state.getIn(["forms", "options", "lookups"], fromJS([]));

const formGroups = (state, locale) => {
  const formGroupsObj = state
    .getIn(["records", "admin", "forms", "formSections"], fromJS([]))
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
};

const agencies = (state, { optionStringsSourceIdKey, locale, useUniqueId = false, filterOptions }) => {
  const stateAgencies = state.getIn(["application", "agencies"], fromJS([]));
  const filteredAgencies = filterOptions ? filterOptions(stateAgencies) : stateAgencies;

  return filteredAgencies.reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get(useUniqueId ? "unique_id" : optionStringsSourceIdKey || "id"),
        display_text: current.getIn(["name", locale], ""),
        disabled: current.get("disabled", false)
      }
    ],
    []
  );
};

const agenciesCurrentUser = (state, { optionStringsSourceIdKey, locale, filterOptions }) => {
  const currentUserAgency = fromJS([getAssignedAgency(state)]);
  const allAgencies = agencies(state, { optionStringsSourceIdKey, locale, useUniqueId: false, filterOptions });

  return allAgencies.map(agency => ({
    ...agency,
    disabled: agency.disabled || !currentUserAgency.includes(agency.id)
  }));
};

const locations = (state, locale, includeAdminLevel = false) =>
  state.getIn(["forms", "options", "locations"], fromJS([])).reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get("code"),
        display_text: displayNameHelper(current.get("name"), locale),
        ...(includeAdminLevel && { admin_level: current.get("admin_level") })
      }
    ],
    []
  );

const reportingLocations = (state, locale) =>
  locations(state, locale, true)
    .filter(location => location.admin_level === getReportingLocationConfig(state).get("admin_level"))
    .map(location => {
      // eslint-disable-next-line camelcase
      const { id, display_text } = location;

      return {
        id,
        display_text
      };
    });

const modules = state =>
  state.getIn(["application", "modules"], fromJS([])).reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get("unique_id"),
        display_text: current.get("name")
      }
    ],
    []
  );

const lookupValues = (state, optionStringsSource, locale, rest) => {
  const { fullLookup } = rest;

  const lookup = lookupsList(state).find(
    option => option.get("unique_id") === optionStringsSource.replace(/lookup /, ""),
    null,
    fromJS({})
  );

  if (fullLookup) {
    return lookup;
  }

  return lookup.get("values", fromJS([])).reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get("id"),
        display_text: displayNameHelper(current.get("display_text"), locale),
        disabled: current.get("disabled", false)
      }
    ],
    []
  );
};

const filterableOptions = (filterOptions, data) => (filterOptions ? filterOptions(data) : data);

const lookups = (state, { locale, t, filterOptions }) => {
  const lookupList = [
    ...lookupsList(state).reduce(
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
            display_text: t(`${custom.toLowerCase()}.label`)
          })),
          lookup => lookup.display_text
        )
      : [])
  ];

  return filterableOptions(filterOptions, lookupList);
};

const userGroups = (state, { filterOptions }) => {
  const applicationUserGroups = getUserGroups(state).reduce(
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

const userGroupsPermitted = (state, { filterOptions }) => {
  const allUserGroups = userGroups(state, { filterOptions });
  const currentUserGroups = getCurrentUserGroupsUniqueIds(state);
  const currentRoleGroupPermission = getCurrentUserGroupPermission(state);

  if (currentRoleGroupPermission === GROUP_PERMISSIONS.ALL) {
    return allUserGroups;
  }

  return allUserGroups.map(userGroup => {
    if (currentUserGroups.includes(userGroup.id)) {
      return userGroup;
    }

    return { ...userGroup, disabled: true };
  });
};

const formGroupLookup = (state, appLocale, { filterOptions }) =>
  filterableOptions(
    filterOptions,
    lookupsList(state)
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

const recordForms = (state, { filterOptions }) => {
  const formSections = getRecordForms(state, { all: true });

  return filterOptions ? filterableOptions(filterOptions, formSections) : formSections;
};

const roles = state => buildRoleOptions(getRoles(state));

const managedRoles = (state, transfer) =>
  state.getIn(["application", "managedRoles"], fromJS([])).filter(role => role.get(transfer, false));

const buildManagedRoles = (state, transfer) =>
  managedRoles(state, transfer).reduce(
    (prev, current) => [...prev, { id: current.get("unique_id"), display_text: current.get("name") }],
    []
  );

const buildPermittedRoles = state => {
  const allRoles = getRoles(state);
  const permittedRoleUniqueIds = getPermittedRoleUniqueIds(state);
  const permittedRoles = permittedRoleUniqueIds?.isEmpty()
    ? allRoles
    : allRoles.map(role =>
        role.set("disabled", role.get("disabled") || !permittedRoleUniqueIds.includes(role.get("unique_id")))
      );

  return buildRoleOptions(permittedRoles);
};

const optionsFromState = (state, optionStringsSource, i18n, useUniqueId, rest = {}) => {
  const { locale, t } = i18n;

  switch (optionStringsSource) {
    case OPTION_TYPES.AGENCY:
      return agencies(state, { ...rest, useUniqueId, locale });
    case OPTION_TYPES.AGENCY_CURRENT_USER:
      return agenciesCurrentUser(state, { ...rest, useUniqueId, locale });
    case OPTION_TYPES.LOCATION:
      return locations(state, locale);
    case OPTION_TYPES.REPORTING_LOCATIONS:
      return reportingLocations(state, locale);
    case OPTION_TYPES.MODULE:
      return modules(state);
    case OPTION_TYPES.FORM_GROUP:
      return formGroups(state, locale);
    case OPTION_TYPES.LOOKUPS:
      return lookups(state, { locale, t, ...rest });
    case OPTION_TYPES.REFER_TO_USERS:
      return referToUsers(state, { ...rest });
    case OPTION_TYPES.USER_GROUP:
      return userGroups(state, { ...rest });
    case OPTION_TYPES.USER_GROUP_PERMITTED:
      return userGroupsPermitted(state, { ...rest });
    case OPTION_TYPES.ROLE:
      return roles(state);
    case OPTION_TYPES.ROLE_EXTERNAL_REFERRAL:
      return buildManagedRoles(state, "referral");
    case OPTION_TYPES.ROLE_PERMITTED:
      return buildPermittedRoles(state);
    case OPTION_TYPES.FORM_GROUP_LOOKUP:
      return formGroupLookup(state, locale, { ...rest });
    case OPTION_TYPES.RECORD_FORMS:
      return recordForms(state, { ...rest });
    default:
      return lookupValues(state, optionStringsSource, locale, { ...rest });
  }
};

const transformOptions = (options, locale) => {
  return options.reduce((prev, current) => {
    const displayText = get(current, "display_text");

    return [
      ...prev,
      {
        ...current,
        id: get(current, "id"),
        display_text: displayNameHelper(displayText, locale) || displayText
      }
    ];
  }, []);
};

export const getOptions = createCachedSelector(
  state => state,
  (_state, optionStringsSource) => optionStringsSource,
  (_state, _optionStringsSource, i18n) => i18n,
  (_state, _optionStringsSource, _i18n, options) => options,
  (_state, _optionStringsSource, _i18n, _options, useUniqueId) => useUniqueId,
  (_state, _optionStringsSource, _i18n, _options, _useUniqueId, rest) => rest,

  (state, optionStringsSource, i18n, options, useUniqueId, rest) => {
    if (optionStringsSource) {
      return optionsFromState(state, optionStringsSource, i18n, useUniqueId, rest);
    }

    if (options) {
      if (rest?.rawOptions) return options;

      return Array.isArray(options) || isImmutable(options)
        ? transformOptions(options, i18n.locale)
        : options?.[i18n.locale];
    }

    return [];
  }
)(
  (_state, optionStringsSource, i18n, options, useUniqueId, rest) =>
    `${optionStringsSource}:${i18n.locale}:${useUniqueId}:${JSON.stringify(rest)}:${JSON.stringify(options)}`
);

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
      const options = current.optionStringSource
        ? getOptions(state, current.optionStringSource, window.I18n, null, true)
        : [];
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

export const getManagedRoleByUniqueId = (state, uniqueID) =>
  managedRoles(state, "referral").find(role => role.get("unique_id") === uniqueID, null, fromJS({}));

export const getManagedRoleFormSections = (state, uniqueID) =>
  getManagedRoleByUniqueId(state, uniqueID).get("form_section_read_write", fromJS({})).keySeq().toList();
