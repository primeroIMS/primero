import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select, MenuItem, FormControl } from "@material-ui/core";
import DateRangeDialog from "../date-range-dialog";
import DateRange from "../../utils/date-range";
import { CUSTOM_RANGE } from "./constants";

const DateRangeSelect = ({
  ranges,
  selectedRange,
  withCustomRange,
  setSelectedRange,
  disabled,
  i18n
}) => {
  const [showRangePicker, setShowRangePicker] = useState(false);

  const [customRange, setCustomRange] = useState(
    new DateRange(
      CUSTOM_RANGE,
      i18n.t("key_performance_indicators.date_range_select.custom_range"),
      selectedRange.from,
      selectedRange.to
    )
  );

  const handleSelectChange = event => {
    if (event.target.value === CUSTOM_RANGE) return;

    const newSelectedRange = ranges.filter(range => range.value === event.target.value)[0];

    setSelectedRange(newSelectedRange);
  };

  const handleSetRange = (from, to) => {
    const newRange = new DateRange(
      CUSTOM_RANGE,
      i18n.t("key_performance_indicators.date_range_select.custom_range"),
      from,
      to
    );

    setSelectedRange(newRange);
    setCustomRange(newRange);
  }
  const handleCustomRangeClick = () => setShowRangePicker(true);
  const handleDateRangeDialogClose = () => setShowRangePicker(false);

  return (
    <FormControl>
      <Select
        onChange={handleSelectChange}
        value={selectedRange.value}
        disabled={disabled}
      >
        {ranges.map(range => (
          <MenuItem key={range.value} value={range.value}>
            {range.name}
          </MenuItem>
        ))}
        {withCustomRange && (
          <MenuItem
            key={CUSTOM_RANGE}
            value={customRange.value}
            onClick={handleCustomRangeClick}
          >
            {i18n.toTime(
              "key_performance_indicators.date_format",
              customRange.from
            )}
            {" "}
            -
            {" "}
            {i18n.toTime(
              "key_performance_indicators.date_format",
              customRange.to
            )}
          </MenuItem>
        )}
      </Select>
      <DateRangeDialog
        open={showRangePicker}
        onClose={handleDateRangeDialogClose}
        currentRange={customRange}
        setRange={handleSetRange}
      />
    </FormControl>
  );
};

DateRangeSelect.displayName = "DateRangeSelect";

DateRangeSelect.proptypes = {
  ranges: PropTypes.array,
  selectedRange: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date)
  }),
  withCustomRange: PropTypes.bool,
  setSelectedRange: PropTypes.func,
  disabled: PropTypes.bool,
  i18n: PropTypes.object
};

export default DateRangeSelect;
