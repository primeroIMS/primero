import React, { useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { useI18n } from "components/I18n";

function DateRangeSelect({ ranges, selectedRange, withCustomRange }) {
  // FIXME: We should use 'useI18n' but it retruns a null object when called
  // from here.
  let i18n = window.I18n;

  let [customRange, setCustomRange] = useState({
    value: 'custom-range',
    from: selectedRange.from,
    to: selectedRange.to,
    name: `${ i18n.toTime('key_performance_indicators.date_format', selectedRange.from) } - ${  i18n.toTime('key_performance_indicators.date_format', selectedRange.to) }`
  })

  return (
    <Select value={selectedRange.value}>
      { ranges.map(r => <MenuItem value={r.value}>{r.name}</MenuItem>) }
      { withCustomRange && <MenuItem value={customRange.value}>{customRange.name}</MenuItem> }
    </Select>
  )
}

export default DateRangeSelect;
