import React, { useState } from "react";
import { Select, MenuItem } from "@material-ui/core";

export default function DateRangeSelect({
  ranges,
  selectedRange,
  withCustomRange,
  setRange
}) {

  let [customRange, setCustomRange] = useState({
    value: 'custom-range',
    from: selectedRange.from,
    to: selectedRange.to,
    name: `${selectedRange.from} - ${selectedRange.to}`
  })

  return (
    <Select value={selectedRange.value}>
      { ranges.map(r => <MenuItem value={r.value}>{r.name}</MenuItem>) }
      { withCustomRange && <MenuItem value={customRange.value}>{customRange.name}</MenuItem> }
    </Select>
  )
}
