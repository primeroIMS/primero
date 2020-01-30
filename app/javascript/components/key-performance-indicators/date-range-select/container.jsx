import React, { useState, useRef } from "react";
import {
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  DialogActions,
  Button
} from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useI18n } from "components/I18n";
import DateRange from "./date-range";

function CustomRangeDialog({ open, onClose, currentRange, setRange }) {
  let [from, setFrom] = useState(currentRange.from);
  let [to, setTo] = useState(currentRange.to);

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Custom Date Range</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Once this change is applied, data will be selected from between the two dates bellow
        </DialogContentText>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              // TODO: This should be localized
              format="dd/MM/yyyy"
              margin="normal"
              label="From"
              value={from}
              onChange={setFrom}
              KeyboardButtonProps={{
                'aria-label': 'Data will be selected after this date'
              }}
            />
            <KeyboardDatePicker
              variant="inline"
              // TODO: This should be localized
              format="dd/MM/yyyy"
              margin="normal"
              label="To"
              value={to}
              onChange={setTo}
              KeyboardButtonProps={{
                'aria-label': 'Data will be selected before this date'
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setRange(from, to);
          onClose();
        }}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DateRangeSelect({ ranges, selectedRange, withCustomRange, setSelectedRange, disabled }) {
  // FIXME: We should use 'useI18n' but it retruns a null object when called
  // from here.
  let i18n = window.I18n;

  let [showRangePicker, setShowRangePicker] = useState(false);
  let [customRange, setCustomRange] = useState(new DateRange(
    'custom-range',
    'Custom Range',
    selectedRange.from,
    selectedRange.to));

  let updateSelectedRange = e => {
    if (e.target.value === 'custom-range')
      return setShowRangePicker(true)

    let newSelectedRange = ranges.filter(r => r.value === e.target.value)[0];
    setSelectedRange(newSelectedRange);
  };

  return (
    <FormControl>
      <Select onChange={updateSelectedRange} value={selectedRange.value} disabled={disabled}>
        { ranges.map(r => <MenuItem value={r.value}>{r.name}</MenuItem>) }
        { withCustomRange &&
          <MenuItem value={customRange.value}>
            {`${i18n.toTime('key_performance_indicators.date_format', customRange.from)} - ${i18n.toTime('key_performance_indicators.date_format', customRange.to)}`}
          </MenuItem>
        }
      </Select>
      <CustomRangeDialog
        open={showRangePicker}
        onClose={() => setShowRangePicker(false)}
        currentRange={customRange}
        setRange={(from, to) => {
          let newRange = new DateRange(
            'custom-range',
            'Custom Range',
            from,
            to
          );
          setSelectedRange(newRange);
          setCustomRange(newRange);
        }}
      />
    </FormControl>
  )
}

export default DateRangeSelect;
