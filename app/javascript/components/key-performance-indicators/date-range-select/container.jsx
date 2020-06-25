import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl
} from "@material-ui/core";

import DateRangeDialog from "../date-range-dialog";
import DateRange from "./date-range";

export default function DateRangeSelect({
  ranges,
  selectedRange,
  withCustomRange,
  setSelectedRange,
  disabled
}) {
  // FIXME: We should use 'useI18n' but it retruns a null object when called
  // from here.
  const i18n = window.I18n;

  const [showRangePicker, setShowRangePicker] = useState(false);
  const [customRange, setCustomRange] = useState(
    new DateRange(
      "custom-range",
      "Custom Range",
      selectedRange.from,
      selectedRange.to
    )
  );

  const updateSelectedRange = e => {
    if (e.target.value === "custom-range") return;

    const newSelectedRange = ranges.filter(r => r.value === e.target.value)[0];

    setSelectedRange(newSelectedRange);
  };

  return (
    <FormControl>
      <Select
        onChange={updateSelectedRange}
        value={selectedRange.value}
        disabled={disabled}
      >
        {ranges.map(r => (
          <MenuItem value={r.value}>{r.name}</MenuItem>
        ))}
        {withCustomRange && (
          <MenuItem
            value={customRange.value}
            onClick={() => setShowRangePicker(true)}
          >
            {`${i18n.toTime(
              "key_performance_indicators.date_format",
              customRange.from
            )} - ${i18n.toTime(
              "key_performance_indicators.date_format",
              customRange.to
            )}`}
          </MenuItem>
        )}
      </Select>
      <DateRangeDialog
        open={showRangePicker}
        onClose={() => setShowRangePicker(false)}
        currentRange={customRange}
        setRange={(from, to) => {
          const newRange = new DateRange(
            "custom-range",
            "Custom Range",
            from,
            to
          );

          setSelectedRange(newRange);
          setCustomRange(newRange);
        }}
      />
    </FormControl>
  );
};
