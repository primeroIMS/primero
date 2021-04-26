import { fromJS, isImmutable } from "immutable";
import isEmpty from "lodash/isEmpty";
import { sortBy } from "lodash";

import { getReportingLocationConfig, getRoles, getUserGroups } from "../application/selectors";
import { displayNameHelper } from "../../libs";
import { getAssignedAgency, getPermittedRoleUniqueIds } from "../user";
import { getRecordForms } from "../record-form";

import { OPTION_TYPES, CUSTOM_LOOKUPS } from "./constants";
import { get, buildRoleOptions } from "./utils";

const referToUsers = (state, { currRecord }) =>
  state
    .getIn(["records", "transitions", "referral", "users"], fromJS([]))
    .reduce((prev, current) => {
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
          display_text: userName
        }
      ];
    }, [])
    .filter(user => !isEmpty(user));

const lookupsList = state => state.getIn(["forms", "options", "lookups"], fromJS([]));

const formGroups = (state, i18n) => {
  const formGroupsObj = state
    .getIn(["records", "admin", "forms", "formSections"], fromJS([]))
    .filter(formSection => !formSection.is_nested && formSection.form_group_id)
    .groupBy(item => item.get("form_group_id"))
    .reduce(
      (prev, current) => [
        ...prev,
        {
          id: current.first().getIn(["form_group_id"], null),
          display_text: current.first().getIn(["form_group_name", i18n.locale], "")
        }
      ],
      []
    );

  return sortBy(formGroupsObj, item => item.display_text);
};

const agencies = (state, { optionStringsSourceIdKey, i18n, useUniqueId = false, filterOptions }) => {
  const stateAgencies = state.getIn(["application", "agencies"], fromJS([]));
  const filteredAgencies = filterOptions ? filterOptions(stateAgencies) : stateAgencies;

  return filteredAgencies.reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get(useUniqueId ? "unique_id" : optionStringsSourceIdKey || "id"),
        display_text: current.getIn(["name", i18n.locale], ""),
        disabled: current.get("disabled")
      }
    ],
    []
  );
};

const agenciesCurrentUser = (state, { optionStringsSourceIdKey, i18n, filterOptions }) => {
  const currentUserAgency = fromJS([getAssignedAgency(state)]);
  const allAgencies = agencies(state, { optionStringsSourceIdKey, i18n, useUniqueId: false, filterOptions });

  return allAgencies.filter(agency => currentUserAgency.includes(agency.id));
};

const locations = (state, i18n, includeAdminLevel = false) =>
  state.getIn(["forms", "options", "locations"], fromJS([])).reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get("code"),
        display_text: displayNameHelper(current.get("name"), i18n.locale),
        ...(includeAdminLevel && { admin_level: current.get("admin_level") })
      }
    ],
    []
  );

const reportingLocations = (state, i18n) =>
  locations(state, i18n, true)
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

const lookupValues = (state, optionStringsSource, i18n, rest) => {
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
        display_text: displayNameHelper(current.get("display_text"), i18n.locale)
      }
    ],
    []
  );
};

const filterableOptions = (filterOptions, data) => (filterOptions ? filterOptions(data) : data);

const lookups = (state, { i18n, filterOptions }) => {
  const lookupList = [
    ...lookupsList(state).reduce(
      (prev, current) => [
        ...prev,
        {
          id: `lookup ${current.get("unique_id")}`,
          display_text: current.getIn(["name", i18n.locale]),
          values: current.get("values", fromJS([])).reduce(
            (valPrev, valCurrent) => [
              ...valPrev,
              {
                id: valCurrent.get("id"),
                display_text: valCurrent.getIn(["display_text", i18n.locale])
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
            display_text: i18n.t(`${custom.toLowerCase()}.label`)
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
      { id: current.get("unique_id"), display_text: current.get("name"), disabled: current.get("disabled") }
    ],
    []
  );

  if (filterOptions) {
    return filterableOptions(filterOptions, applicationUserGroups);
  }

  return applicationUserGroups;
};

const formGroupLookup = (state, i18n, { filterOptions }) =>
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
                  display_text: valCurrent.getIn(["display_text", i18n.locale])
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
  switch (optionStringsSource) {
    case OPTION_TYPES.AGENCY:
      return agencies(state, { ...rest, useUniqueId, i18n });
    case OPTION_TYPES.AGENCY_CURRENT_USER:
      return agenciesCurrentUser(state, { ...rest, useUniqueId, i18n });
    case OPTION_TYPES.LOCATION:
      return locations(state, i18n);
    case OPTION_TYPES.REPORTING_LOCATIONS:
      return reportingLocations(state, i18n);
    case OPTION_TYPES.MODULE:
      return modules(state);
    case OPTION_TYPES.FORM_GROUP:
      return formGroups(state, i18n);
    case OPTION_TYPES.LOOKUPS:
      return lookups(state, { i18n, ...rest });
    case OPTION_TYPES.REFER_TO_USERS:
      return referToUsers(state, { ...rest });
    case OPTION_TYPES.USER_GROUP:
      return userGroups(state, { ...rest });
    case OPTION_TYPES.ROLE:
      return roles(state);
    case OPTION_TYPES.ROLE_EXTERNAL_REFERRAL:
      return buildManagedRoles(state, "referral");
    case OPTION_TYPES.ROLE_PERMITTED:
      return buildPermittedRoles(state);
    case OPTION_TYPES.FORM_GROUP_LOOKUP:
      return formGroupLookup(state, i18n, { ...rest });
    case OPTION_TYPES.RECORD_FORMS:
      return recordForms(state, { ...rest });
    default:
      return lookupValues(state, optionStringsSource, i18n, { ...rest });
  }
};

const transformOptions = (options, i18n) => {
  return options.reduce((prev, current) => {
    const displayText = get(current, "display_text");

    return [
      ...prev,
      {
        ...current,
        id: get(current, "id"),
        display_text: displayNameHelper(displayText, i18n.locale) || displayText
      }
    ];
  }, []);
};

// eslint-disable-next-line import/prefer-default-export
export const getOptions = (
  state,
  optionStringsSource,
  i18n,
  options,
  useUniqueId = false,
  rest = {
    rawOptions: false
  }
) => {
  if (optionStringsSource) {
    return optionsFromState(state, optionStringsSource, i18n, useUniqueId, rest);
  }

  if (options) {
    if (rest.rawOptions) return options;

    return Array.isArray(options) || isImmutable(options) ? transformOptions(options, i18n) : options?.[i18n.locale];
  }

  return [];
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
