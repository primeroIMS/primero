import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select, MenuItem, FormControl } from "@material-ui/core";

import DateRangeDialog from "../date-range-dialog";

import DateRange from "../../date-range";

const DateRangeSelect = ({
  ranges,
  selectedRange,
  withCustomRange,
  setSelectedRange,
  disabled
}) => {
  // FIXME: We should use 'useI18n' but it returns a null object when called
  //        from here.
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
          <MenuItem key={r.value} value={r.value}>
            {r.name}
          </MenuItem>
        ))}
        {withCustomRange && (
          <MenuItem
            key="custom-range"
            value={customRange.value}
            onClick={() => setShowRangePicker(true)}
          >
            `$
            {i18n.toTime(
              "key_performance_indicators.date_format",
              customRange.from
            )}{" "}
            - $
            {i18n.toTime(
              "key_performance_indicators.date_format",
              customRange.to
            )}
            `
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

DateRangeSelect.displayName = "DateRangeSelect";

DateRangeSelect.proptypes = {
  ranges: PropTypes.array,
  selectedRange: PropTypes.objectOf({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date)
  }),
  withCustomRange: PropTypes.bool,
  setSelectedRange: PropTypes.func,
  disabled: PropTypes.bool
};

export default DateRangeSelect;
