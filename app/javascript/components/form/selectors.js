import { fromJS, Map } from "immutable";

import { getReportingLocationConfig, getRoles, getUserGroups } from "../application/selectors";
import { displayNameHelper } from "../../libs";

import { OPTION_TYPES, CUSTOM_LOOKUPS } from "./constants";

const referToUsers = state =>
  state.getIn(["records", "transitions", "referral", "users"], fromJS([])).map(user => {
    const userName = user.get("user_name");

    return {
      id: userName.toLowerCase(),
      display_text: userName
    };
  });

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

const agencies = (state, { optionStringsSourceIdKey, i18n, useUniqueId = false }) =>
  state.getIn(["application", "agencies"], fromJS([])).map(agency => ({
    id: agency.get(useUniqueId ? "unique_id" : optionStringsSourceIdKey || "id"),
    display_text: agency.getIn(["name", i18n.locale], "")
  }));

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
  state
    .getIn(["forms", "options", "lookups", "data"], fromJS([]))
    .find(option => option.get("unique_id") === optionStringsSource.replace(/lookup /, ""), null, fromJS({}))
    .get("values", fromJS([]))
    .reduce(
      (result, item) =>
        result.push(
          Map({
            id: item.get("id"),
            display_text: item.getIn(["display_text", i18n.locale], "")
          })
        ),
      fromJS([])
    );

const lookups = (state, i18n) =>
  state
    .getIn(["forms", "options", "lookups", "data"], fromJS([]))
    .map(lookup =>
      fromJS({
        id: `lookup ${lookup.get("unique_id")}`,
        display_text: lookup.getIn(["name", i18n.locale])
      })
    )
    .concat(
      fromJS(CUSTOM_LOOKUPS).map(custom =>
        fromJS({
          id: custom,
          display_text: i18n.t(`${custom.toLowerCase()}.label`)
        })
      )
    )
    .sortBy(lookup => lookup.get("display_text"));

const userGroups = state =>
  getUserGroups(state).map(userGroup =>
    fromJS({ id: userGroup.get("unique_id"), display_text: userGroup.get("name") })
  );

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
      return lookups(state, i18n);
    case OPTION_TYPES.REFER_TO_USERS:
      return referToUsers(state);
    case OPTION_TYPES.USER_GROUP:
      return userGroups(state);
    case OPTION_TYPES.ROLE:
      return roles(state);
    case OPTION_TYPES.ROLE_EXTERNAL_REFERRAL:
      return buildManagedRoles(state, "referral");
    default:
      return lookupValues(state, optionStringsSource, i18n);
  }
};

const transformOptions = (options, i18n) =>
  options.map(option => {
    return fromJS({
      id: option.id,
      display_text: displayNameHelper(option.display_text, i18n.locale) || option.display_text
    });
  });

// eslint-disable-next-line import/prefer-default-export
export const getOptions = (state, optionStringsSource, i18n, options, useUniqueId = false, rest = {}) => {
  if (optionStringsSource) {
    return optionsFromState(state, optionStringsSource, i18n, useUniqueId, rest);
  }

  if (options) {
    return fromJS(Array.isArray(options) ? transformOptions(options, i18n) : options?.[i18n.locale]);
  }

  return fromJS([]);
};

export const getLookupByUniqueId = (state, lookupUniqueId) =>
  state
    .getIn(["forms", "options", "lookups", "data"], fromJS([]))
    .find(lookup => lookup.get("unique_id") === lookupUniqueId);

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

export const getManagedRoleFormSections = (state, uniqueID) =>
  managedRoles(state, "referral")
    .find(role => role.get("unique_id") === uniqueID, null, fromJS({}))
    .get("form_section_unique_ids", fromJS([]));
