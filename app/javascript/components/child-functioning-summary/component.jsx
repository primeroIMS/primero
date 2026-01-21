import PropTypes from "prop-types";

import { toServerDateFormat } from "../../libs";
import { useI18n } from "../i18n";

import childFunctioningSummaryData from "./child-functioning-summary-data";

/* -------------------- Helpers -------------------- */

const formatKey = key => {
  const str = key.replace(/_/g, " ");

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const isYes = value => value === true || value === "true" || value === "yes" || value === "Yes";

const isSevereDifficulty = value => value === "a_lot_of_difficulty" || value === "cannot_do_at_all";

const shouldShowField = (field, values) => {
  // Existing showIf logic
  if (field.showIf) {
    const conditionKey = typeof field.showIf.key === "function" ? field.showIf.key(values) : field.showIf.key;

    const conditionValue = values[conditionKey];

    if (field.showIf.equals === "yes") {
      if (!isYes(conditionValue)) return false;
    }

    if (field.showIf.equals === "no") {
      if (isYes(conditionValue)) return false;
    }
  }

  // 🔴 NEW: hide 500m if 100m is severe
  if (field.hideIfSevere100m) {
    const hundredKey =
      typeof field.hideIfSevere100m === "function" ? field.hideIfSevere100m(values) : field.hideIfSevere100m;

    const hundredValue = values[hundredKey];

    if (isSevereDifficulty(hundredValue)) {
      return false;
    }
  }

  return true;
};

const formatValue = (key, value, i18n) => {
  if (typeof value === "boolean") {
    return value ? i18n.t("cases.child_functioning.cfm_yes") : i18n.t("cases.child_functioning.cfm_no");
  }

  if (typeof value === "string") {
    if (value === "true") return i18n.t("cases.child_functioning.cfm_yes");
    if (value === "false") return i18n.t("cases.child_functioning.cfm_no");

    if (key.includes("age") && value.includes("_")) {
      return `${value.replace("_", " to ")} years`;
    }

    if (value.includes("_")) {
      return value.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
    }

    if (/^[a-z]+$/.test(value)) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    const parsedDate = new Date(value);

    if (!Number.isNaN(parsedDate.getTime())) {
      return toServerDateFormat(parsedDate, { includeTime: false });
    }

    return value;
  }

  return value;
};

function Component({ values = null }) {
  const i18n = useI18n();

  if (!values) return null;

  const displayedKeys = new Set();

  return (
    <>
      {values.cfm_start && <h3>Summary</h3>}

      {childFunctioningSummaryData.map(field => {
        const key = typeof field.key === "function" ? field.key(values) : field.key;

        if (!key || displayedKeys.has(key)) return null;

        if (!shouldShowField(field, values)) return null;

        const value = values[key];

        if (!value || value === i18n.t("cases.child_functioning.n_a") || value === "") {
          return null;
        }

        displayedKeys.add(key);

        return (
          <div key={key} style={{ marginBottom: "8px" }}>
            <strong>{formatKey(i18n.t(field.label))}:</strong> {formatValue(key, value, i18n)}
          </div>
        );
      })}
    </>
  );
}

Component.displayName = "ChildFunctioningSummary";

Component.propTypes = {
  values: PropTypes.shape({
    cfm_start: PropTypes.string
  })
};

export default Component;
