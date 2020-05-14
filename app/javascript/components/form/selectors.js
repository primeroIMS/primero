import { fromJS, Map } from "immutable";

const OPTION_TYPES = {
  AGENCY: "Agency",
  LOCATION: "Location",
  MODULE: "Module",
  FORM_GROUP: "FormGroup"
};

const formGroups = (state, locale) =>
  state
    .getIn(["records", "admin", "forms", "formSections"], fromJS([]))
    .filter(formSection => !formSection.is_nested && formSection.form_group_id)
    .groupBy(item => item.get("form_group_id"))
    .reduce(
      (result, item) =>
        result.push(
          Map({
            id: item.first().getIn(["form_group_id"], null),
            display_text: item.first().getIn(["form_group_name", locale], "")
          })
        ),
      fromJS([])
    )
    .sortBy(item => item.get("display_text"));

const agencies = state =>
  state.getIn(["application", "agencies"], fromJS([])).map(agency => ({
    id: agency.get("id"),
    display_text: agency.get("name")
  }));

const locations = (state, locale) =>
  state.getIn(["forms", "options", "locations"], fromJS([])).map(location => ({
    id: location.get("code"),
    display_text: location.getIn(["name", locale], "")
  }));

const modules = state =>
  state.getIn(["application", "modules"], fromJS([])).map(module => ({
    id: module.get("unique_id"),
    display_text: module.get("name")
  }));

const lookups = (state, optionStringsSource, locale) =>
  state
    .getIn(["forms", "options", "lookups", "data"], fromJS([]))
    .find(
      option =>
        option.get("unique_id") === optionStringsSource.replace(/lookup /, ""),
      null,
      fromJS({})
    )
    .get("values", fromJS([]))
    .reduce(
      (result, item) =>
        result.push(
          Map({
            id: item.get("id"),
            display_text: item.getIn(["display_text", locale], "")
          })
        ),
      fromJS([])
    );

const optionsFromState = (state, optionStringsSource, locale) => {
  switch (optionStringsSource) {
    case OPTION_TYPES.AGENCY:
      return agencies(state);
    case OPTION_TYPES.LOCATION:
      return locations(state, locale);
    case OPTION_TYPES.MODULE:
      return modules(state);
    case OPTION_TYPES.FORM_GROUP:
      return formGroups(state, locale);
    default:
      return lookups(state, optionStringsSource, locale);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const getOptions = (state, optionStringsSource, locale, options) => {
  if (optionStringsSource) {
    return optionsFromState(state, optionStringsSource, locale);
  }

  if (options) {
    return fromJS(Array.isArray(options) ? options : options?.[locale]);
  }

  return fromJS([]);
};
