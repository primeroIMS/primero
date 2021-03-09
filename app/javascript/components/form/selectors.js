import { fromJS, Map } from "immutable";
import isEmpty from "lodash/isEmpty";

import { getReportingLocationConfig, getRoles, getUserGroups } from "../application/selectors";
import { displayNameHelper } from "../../libs";
import { getRecordForms } from "../record-form";

import { OPTION_TYPES, CUSTOM_LOOKUPS } from "./constants";

const referToUsers = (state, { currRecord }) =>
  state
    .getIn(["records", "transitions", "referral", "users"], fromJS([]))
    .map(user => {
      const userName = user.get("user_name");

      if (!isEmpty(currRecord)) {
        const currUser = currRecord.get("owned_by");

        if (currUser && currUser === userName) {
          return {};
        }
      }

      return {
        id: userName.toLowerCase(),
        display_text: userName
      };
    })
    .filter(user => !isEmpty(user));

const lookupsList = state => state.getIn(["forms", "options", "lookups"], fromJS([]));

const formGroups = (state, i18n) =>
  state
    .getIn(["records", "admin", "forms", "formSections"], fromJS([]))
    .filter(formSection => !formSection.is_nested && formSection.form_group_id)
    .groupBy(item => item.get("form_group_id"))
    .reduce(
      (result, item) =>
        result.push(
          Map({
            id: item.first().getIn(["form_group_id"], null),
            display_text: item.first().getIn(["form_group_name", i18n.locale], "")
          })
        ),
      fromJS([])
    )
    .sortBy(item => item.get("display_text"));

const agencies = (state, { optionStringsSourceIdKey, i18n, useUniqueId = false, filterOptions }) => {
  const stateAgencies = state.getIn(["application", "agencies"], fromJS([]));
  const filteredAgencies = filterOptions ? filterOptions(stateAgencies) : stateAgencies;

  return filteredAgencies.map(agency => ({
    id: agency.get(useUniqueId ? "unique_id" : optionStringsSourceIdKey || "id"),
    display_text: agency.getIn(["name", i18n.locale], "")
  }));
};

const locations = (state, i18n, includeAdminLevel = false) =>
  state.getIn(["forms", "options", "locations"], fromJS([])).map(location => ({
    id: location.get("code"),
    display_text: displayNameHelper(location.get("name")?.toJS(), i18n.locale),
    ...(includeAdminLevel && { admin_level: location.get("admin_level") })
  }));

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
  state.getIn(["application", "modules"], fromJS([])).map(module => ({
    id: module.get("unique_id"),
    display_text: module.get("name")
  }));

const lookupValues = (state, optionStringsSource, i18n) =>
  lookupsList(state)
    .find(option => option.get("unique_id") === optionStringsSource.replace(/lookup /, ""), null, fromJS({}))
    .get("values", fromJS([]))
    .reduce(
      (result, item) =>
        result.push(
          Map({
            id: item.get("id"),
            display_text: displayNameHelper(item.get("display_text"), i18n.locale)
          })
        ),
      fromJS([])
    );

const filterableOptions = (filterOptions, data) => (filterOptions ? filterOptions(data) : data);

const lookups = (state, { i18n, filterOptions }) => {
  let lookupList = lookupsList(state).map(lookup =>
    fromJS({
      id: `lookup ${lookup.get("unique_id")}`,
      display_text: lookup.getIn(["name", i18n.locale]),
      values: lookup.get("values", fromJS([])).map(value => ({
        id: value.get("id"),
        display_text: value.getIn(["display_text", i18n.locale])
      }))
    })
  );

  if (!filterOptions) {
    lookupList = lookupList
      .concat(
        fromJS(CUSTOM_LOOKUPS).map(custom =>
          fromJS({
            id: custom,
            display_text: i18n.t(`${custom.toLowerCase()}.label`)
          })
        )
      )
      .sortBy(lookup => lookup.get("display_text"));
  }

  return filterableOptions(filterOptions, lookupList);
};

const userGroups = state =>
  getUserGroups(state).map(userGroup =>
    fromJS({ id: userGroup.get("unique_id"), display_text: userGroup.get("name") })
  );

const formGroupLookup = (state, { filterOptions }) =>
  filterableOptions(
    filterOptions,
    lookupsList(state).filter(lookup => lookup.get("unique_id").startsWith("lookup-form-group-"))
  );

const recordForms = (state, { filterOptions }) => {
  const formSections = getRecordForms(state, { all: true });

  return filterOptions ? filterableOptions(filterOptions, formSections) : formSections;
};

const roles = state =>
  getRoles(state).map(role => fromJS({ id: role.get("unique_id"), display_text: role.get("name") }));

const managedRoles = (state, transfer) =>
  state.getIn(["application", "managedRoles"], fromJS([])).filter(role => role.get(transfer, false));

const buildManagedRoles = (state, transfer) =>
  managedRoles(state, transfer).map(role => fromJS({ id: role.get("unique_id"), display_text: role.get("name") }));

const optionsFromState = (state, optionStringsSource, i18n, useUniqueId, rest) => {
  switch (optionStringsSource) {
    case OPTION_TYPES.AGENCY:
      return agencies(state, { ...rest, useUniqueId, i18n });
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
      return userGroups(state);
    case OPTION_TYPES.ROLE:
      return roles(state);
    case OPTION_TYPES.ROLE_EXTERNAL_REFERRAL:
      return buildManagedRoles(state, "referral");
    case OPTION_TYPES.FORM_GROUP_LOOKUP:
      return formGroupLookup(state, { ...rest });
    case OPTION_TYPES.RECORD_FORMS:
      return recordForms(state, { ...rest });
    default:
      return lookupValues(state, optionStringsSource, i18n);
  }
};

const transformOptions = (options, i18n) =>
  options.map(option => {
    return fromJS({
      ...option,
      id: option.id,
      display_text: displayNameHelper(option.display_text, i18n.locale) || option.display_text
    });
  });

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

    return fromJS(Array.isArray(options) ? transformOptions(options, i18n) : options?.[i18n.locale]);
  }

  return fromJS([]);
};

export const getLookupByUniqueId = (state, lookupUniqueId) =>
  lookupsList(state).find(lookup => lookup.get("unique_id") === lookupUniqueId);

export const getLoadingState = (state, path) => (path ? state.getIn(path, false) : false);

export const getValueFromOtherField = (state, fields, values) => {
  return fields.reduce((prev, current) => {
    prev.push([
      current.field,
      state
        .getIn(current.path, fromJS([]))
        .find(entity => entity[current.key] === values[current.key], null, fromJS({}))
        .get(current.key, "")
    ]);

    return prev;
  }, []);
};

export const getManagedRoleByUniqueId = (state, uniqueID) =>
  managedRoles(state, "referral").find(role => role.get("unique_id") === uniqueID, null, fromJS({}));

export const getManagedRoleFormSections = (state, uniqueID) =>
  getManagedRoleByUniqueId(state, uniqueID).get("form_section_unique_ids", fromJS([]));
