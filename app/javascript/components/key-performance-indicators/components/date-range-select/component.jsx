import { useState } from "react";
import PropTypes from "prop-types";
import { Select, MenuItem, FormControl } from "@material-ui/core";

import DateRangeDialog from "../date-range-dialog";
import DateRange from "../../utils/date-range";

import { CUSTOM_RANGE } from "./constants";

const Component = ({ ranges, selectedRange, withCustomRange, setSelectedRange, disabled, i18n }) => {
  const [showRangePicker, setShowRangePicker] = useState(false);

  const [customRange, setCustomRange] = useState(
    new DateRange(
      CUSTOM_RANGE,
      i18n.t("key_performance_indicators.date_range_select.custom_range"),
      selectedRange.from,
      selectedRange.to
    )
  );

  const [showCustomLabel, setShowCustomLabel] = useState(false);

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
  };
  const handleCustomRangeClick = () => setShowRangePicker(true);
  const handleDateRangeDialogClose = () => {
    setShowRangePicker(false);
    setShowCustomLabel(false);
  };
  const handleSelectOpen = () => setShowCustomLabel(true);
  const handleSelectClose = () => {
    // This is a little hacky. It's just to that the transition from open
    // with label isn't as jarring to closed without label
    setTimeout(() => setShowCustomLabel(false), 150);
  };

  const customRangeDates = `${i18n.toTime("key_performance_indicators.date_format", customRange.from)} - ${i18n.toTime(
    "key_performance_indicators.date_format",
    customRange.to
  )}`;

  return (
    <FormControl>
      <Select
        onOpen={handleSelectOpen}
        onClose={handleSelectClose}
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
          <MenuItem key={CUSTOM_RANGE} value={customRange.value} onClick={handleCustomRangeClick}>
            {showCustomLabel ? customRange.name : customRangeDates}
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

Component.displayName = "DateRangeSelect";

Component.propTypes = {
  disabled: PropTypes.bool,
  i18n: PropTypes.object,
  ranges: PropTypes.array,
  selectedRange: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
    value: PropTypes.string
  }),
  setSelectedRange: PropTypes.func,
  withCustomRange: PropTypes.bool
};

export default Component;
