import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  DialogActions,
  Button
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export default function DateRangeDialog({ open, onClose, currentRange, setRange }) {
  const [from, setFrom] = useState(currentRange.from);
  const [to, setTo] = useState(currentRange.to);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Custom Date Range</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Once this change is applied, data will be selected from between the
          two dates bellow
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
                "aria-label": "Data will be selected after this date"
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
                "aria-label": "Data will be selected before this date"
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setRange(from, to);
            onClose();
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};
