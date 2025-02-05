import React from 'react';
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
    if (!isNaN(Date.parse(value))) return new Date(value).toLocaleDateString();
    return value;
  }
  return value; // Handle non-string values
};

const SubformSummary = ({ latestValue }) => {
  
  if (!latestValue) return null;
  // Track already displayed keys to prevent duplicates
  const displayedKeys = new Set();
  return (
    <>
      {latestValue.cfm_start !== "" ?<h3>Summary</h3>:null}
      {childFunctioningSummaryData.map((field) => {
        const key = typeof field.key === "function" ? field.key(latestValue) : field.key;

        if (!key || displayedKeys.has(key)) return null; // Skip invalid keys or already displayed keys

        const value = latestValue[key];
        if (!value || value === "N/A" || value === "") return null; // Skip invalid values

        // Mark the key as displayed
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

export default SubformSummary;
