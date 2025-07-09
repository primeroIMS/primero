import { useMemoizedSelector } from "../../libs";
import { useI18n } from "../i18n";

import { selectUserModules } from "./selectors";
import { useApp } from "./use-app";

const ALLOWED_FILTER_KEYS = [
  "protection_concerns",
  "risk_level",
  "protection_risk",
  "self_harm_risk",
  "record_owner",
  "current_location",
  "protection_status",
  "violence_type"
];
const ALLOWED_LIST_HEADER_KEYS = ["name", "record_owner", "client_code", "current_location", "violence_type"];
const ALLOWED_DASHBOARD_KEYS = ["protection_concerns", "risk_level"];

function selectAllowedFeatureKeys(feature) {
  switch (feature) {
    case "filter":
      return ALLOWED_FILTER_KEYS;
    case "listHeader":
      return ALLOWED_LIST_HEADER_KEYS;
    case "dashboard":
      return ALLOWED_DASHBOARD_KEYS;
    default:
      return [];
  }
}

function useSystemStrings(feature) {
  const i18n = useI18n();
  const { fieldLabels } = useApp();
  const userModules = useMemoizedSelector(state => selectUserModules(state));

  return {
    label: (key, fallbackI18nKey) => {
      if (feature) {
        const systemOrDefaultFieldLabel = fieldLabels.getIn([key, i18n.locale], i18n.t(fallbackI18nKey || key));
        const allowedKeys = selectAllowedFeatureKeys(feature);

        if (allowedKeys.includes(key)) {
          if (userModules.size === 1) {
            return userModules.first().getIn(["field_labels", key, i18n.locale], systemOrDefaultFieldLabel);
          }

          return systemOrDefaultFieldLabel;
        }

        return i18n.t(fallbackI18nKey || key);
      }

      return i18n.t(fallbackI18nKey || key);
    }
  };
}

export default useSystemStrings;
