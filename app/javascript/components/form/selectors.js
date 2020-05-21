import { fromJS, Map } from "immutable";

const OPTION_TYPES = {
  AGENCY: "Agency",
  LOCATION: "Location",
  MODULE: "Module",
  FORM_GROUP: "FormGroup",
  LOOKUPS: "Lookups"
};

const CUSTOM_LOOKUPS = ["User", "Agency", "Location"];

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
            display_text: item
              .first()
              .getIn(["form_group_name", i18n.locale], "")
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

const locations = (state, i18n) =>
  state.getIn(["forms", "options", "locations"], fromJS([])).map(location => ({
    id: location.get("code"),
    display_text: location.getIn(["name", i18n.locale], "")
  }));

const modules = state =>
  state.getIn(["application", "modules"], fromJS([])).map(module => ({
    id: module.get("unique_id"),
    display_text: module.get("name")
  }));

const lookupValues = (state, optionStringsSource, i18n) =>
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

const optionsFromState = (state, optionStringsSource, i18n) => {
  switch (optionStringsSource) {
    case OPTION_TYPES.AGENCY:
      return agencies(state);
    case OPTION_TYPES.LOCATION:
      return locations(state, i18n);
    case OPTION_TYPES.MODULE:
      return modules(state);
    case OPTION_TYPES.FORM_GROUP:
      return formGroups(state, i18n);
    case OPTION_TYPES.LOOKUPS:
      return lookups(state, i18n);
    default:
      return lookupValues(state, optionStringsSource, i18n);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const getOptions = (state, optionStringsSource, i18n, options) => {
  if (optionStringsSource) {
    return optionsFromState(state, optionStringsSource, i18n);
  }

  if (options) {
    return fromJS(Array.isArray(options) ? options : options?.[i18n.locale]);
  }

  return fromJS([]);
};
