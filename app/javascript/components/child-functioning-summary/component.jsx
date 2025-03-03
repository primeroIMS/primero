import PropTypes from "prop-types";

import { toServerDateFormat } from "../../libs";
import { useI18n } from "../i18n";

import childFunctioningSummaryData from "./child-functioning-summary-data";

const formatKey = key => key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());

const formatValue = (key, value) => {
  if (typeof value === "string") {
    if (value === "true") return "Yes";
    if (value === "false") return "No";
    if (key.includes("age") && value.includes("_")) return `${value.replace("_", " to ")} years`;
    if (value.includes("_")) return value.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
    const parsedDate = new Date(value);

    if (!Number.isNaN(parsedDate.getTime())) {
      return toServerDateFormat(parsedDate, { includeTime: false });
    }

    return value;
  }

  return value; // Handle non-string values
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
        const value = values[key];

        if (!value || value === i18n.t("cases.child_functioning.n_a") || value === "") return null;
        displayedKeys.add(key);

        return (
          <div key={key} style={{ marginBottom: "8px" }}>
            <strong>{formatKey(i18n.t(field.label))}:</strong> {formatValue(key, value)}
          </div>
        );
      })}
    </>
  );
}

Component.displayName = "ChildFunctioningSummary"; // Added display name

Component.propTypes = {
  values: PropTypes.shape({
    cfm_start: PropTypes.string
  })
};

export default Component;
