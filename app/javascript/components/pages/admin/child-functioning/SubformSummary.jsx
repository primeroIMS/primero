import React from 'react';
import PropTypes from 'prop-types';
import { toServerDateFormat } from "../../../../libs";
import childFunctioningSummaryData from './childFunctioningSummaryData';

const formatKey = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatValue = (key, value) => {
  if (typeof value === "string") {
    if (value === "true") return "Yes";
    if (value === "false") return "No";
    if (key.includes("age") && value.includes("_"))
      return `${value.replace("_", " to ")} years`;
    if (value.includes("_"))
      return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return toServerDateFormat(parsedDate, { includeTime: false });
    }
    return value;
  }
  return value; // Handle non-string values
};

const SubformSummary = ({ latestValue }) => {
  if (!latestValue) return null;

  const displayedKeys = new Set();
  return (
    <>
      {latestValue.cfm_start && <h3>Summary</h3>}
      {childFunctioningSummaryData.map((field) => {
        const key = typeof field.key === "function" ? field.key(latestValue) : field.key;
        if (!key || displayedKeys.has(key)) return null;

        const value = latestValue[key];
        if (!value || value === "N/A" || value === "") return null;

        displayedKeys.add(key);
        return (
          <div key={key} style={{ marginBottom: "8px" }}>
            <strong>{formatKey(field.label)}:</strong> {formatValue(key, value)}
          </div>
        );
      })}
    </>
  );
};

SubformSummary.displayName = 'SubformSummary';  // Added display name

SubformSummary.propTypes = {
  latestValue: PropTypes.shape({
    cfm_start: PropTypes.string
  }),
};

SubformSummary.defaultProps = {
  latestValue: null,
};

export default SubformSummary;
