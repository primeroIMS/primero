import React, { useState } from "react";
import PropTypes from "prop-types";
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

import { useI18n } from "../../i18n";

const DateRangeDialog = ({ open, onClose, currentRange, setRange }) => {
  const i18n = useI18n();
  const [from, setFrom] = useState(currentRange.from);
  const [to, setTo] = useState(currentRange.to);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {i18n.t("key_performance_indicators.date_range_dialog.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {i18n.t("key_performance_indicators.date_range_dialog.description")}
        </DialogContentText>
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              // NOTE: using translations here causes an error, probably becuase of missing
              //       translations. How do we handle translations in tests?
              format="dd/MM/yyyy" // {i18n.t('key_performance_indicators.long_date_format')}
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
              // NOTE: using translations here causes an error, probably becuase of missing
              //       translations. How do we handle translations in tests?
              format="dd/MM/yyyy" // {i18n.t('key_performance_indicators.long_date_format')}
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
          {i18n.t("key_performance_indicators.date_range_dialog.apply")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DateRangeDialog.displayName = "DateRangeDialog";

DateRangeDialog.propTypes = {
  currentRange: PropTypes.objectOf({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date)
  }),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  setRange: PropTypes.func
};

export default DateRangeDialog;
