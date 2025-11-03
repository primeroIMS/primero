import isEmpty from "lodash/isEmpty";

import { useMemoizedSelector } from "../../libs";
import { useI18n } from "../i18n";

import { selectUserModules } from "./selectors";
import { useApp } from "./use-app";

const ALLOWED_FILTER_KEYS = [
  "protection_concerns",
  "risk_level",
  "protection_risks",
  "self_harm_risk",
  "record_owner",
  "current_location",
  "protection_status",
  "violence_type",
  "workflow",
  "referred_cases",
  "my_cases",
  "type_of_risk",
  "loc:owned_by_location2"
];
const ALLOWED_LIST_HEADER_KEYS = [
  "priority",
  "name",
  "record_owner",
  "social_worker",
  "client_code",
  "current_location",
  "violence_type",
  "label"
];
const ALLOWED_DASHBOARD_KEYS = [
  "dashboard.protection_concerns",
  "dashboard.case_risk",
  "dashboard.flagged_cases",
  "dashboard.action_needed.cases",
  "dashboard.case_overview",
  "dashboard.dash_group_overview",
  "dashboard.workflow_team",
  "dashboard.cases_by_social_worker",
  "dashboard.reporting_locations"
];
const ALLOWED_NAVIGATION_KEYS = ["navigation.cases"];
const ALLOWED_ACTION_BUTTON_KEYS = ["case.skip_and_create"];
const ALLOWED_PAGE_KEYS = [
  "cases.label",
  "case.create_new_case",
  "cases.register_new_case",
  "cases.show_case",
  "cases.selected_all_records",
  "cases.selected_records",
  "cases.selected_records_assign",
  "case.skip_and_create"
];
const ALLOWED_FORM_KEYS = ["incidents.type_violence"];

const FILTER = "filter";
const LIST_HEADER = "listHeader";
const DASHBOARD = "dashboard";
const NAVIGATION = "navigation";
const PAGE = "page";
const ACTION_BUTTON = "actionButton";
const FORMS = "form";

function selectAllowedFeatureKeys(feature) {
  switch (feature) {
    case FILTER:
      return ALLOWED_FILTER_KEYS;
    case LIST_HEADER:
      return ALLOWED_LIST_HEADER_KEYS;
    case DASHBOARD:
      return ALLOWED_DASHBOARD_KEYS;
    case NAVIGATION:
      return ALLOWED_NAVIGATION_KEYS;
    case PAGE:
      return ALLOWED_PAGE_KEYS;
    case ACTION_BUTTON:
      return ALLOWED_ACTION_BUTTON_KEYS;
    case FORMS:
      return ALLOWED_FORM_KEYS;
    default:
      return [];
  }
}

function useSystemStrings(feature) {
  const i18n = useI18n();
  const { fieldLabels } = useApp();
  const userModules = useMemoizedSelector(state => selectUserModules(state));

  function interpolate(message, options) {
    return i18n.interpolate(message, options);
  }

  return {
    label: (key, fallbackI18nKey, options = {}) => {
      const fallback = options.noTranslateFallback ? fallbackI18nKey : i18n.t(fallbackI18nKey || key, options);

      if (feature) {
        const systemOrDefaultFieldLabel = fieldLabels.getIn(
          [key, i18n.locale],
          options.noTranslateFallback ? fallbackI18nKey : i18n.t(fallbackI18nKey || key, options)
        );
        const allowedKeys = selectAllowedFeatureKeys(feature);

        if (allowedKeys.includes(key)) {
          if (userModules.size === 1) {
            const message = userModules.first().getIn(["field_labels", key, i18n.locale], systemOrDefaultFieldLabel);

            if (!isEmpty(options)) {
              return interpolate(message, options);
            }

            return message;
          }

          if (!isEmpty(options)) {
            return interpolate(systemOrDefaultFieldLabel, options);
          }

          return systemOrDefaultFieldLabel;
        }

        return fallback;
      }

      return fallback;
    }
  };
}

export default useSystemStrings;

export { FILTER, LIST_HEADER, DASHBOARD, NAVIGATION, PAGE, ACTION_BUTTON, FORMS };
