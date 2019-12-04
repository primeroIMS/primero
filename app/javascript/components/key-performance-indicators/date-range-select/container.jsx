import React, { useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { format } from "date-fns";
import { withI18n } from "../../I18n";

function DateRangeSelect({
  ranges,
  selectedRange,
  withCustomRange,
  setRange,
  locale
}) {

  let [customRange, setCustomRange] = useState({
    value: 'custom-range',
    from: selectedRange.from,
    to: selectedRange.to,
    name: `${format(selectedRange.from, 'MMM yyyy', { locale: locale })} - ${format(selectedRange.to, 'MMM yyyy', { locale: locale })}`
  })

  return (
    <Select value={selectedRange.value}>
      { ranges.map(r => <MenuItem value={r.value}>{r.name}</MenuItem>) }
      { withCustomRange && <MenuItem value={customRange.value}>{customRange.name}</MenuItem> }
    </Select>
  )
}

export default withI18n(DateRangeSelect);
