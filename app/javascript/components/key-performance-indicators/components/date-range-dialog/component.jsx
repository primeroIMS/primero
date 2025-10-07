// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  DialogActions,
  Button
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { useI18n } from "../../../i18n";
import { DATE_FORMAT } from "../../../../config";
import DateProvider from "../../../../date-provider";
import { dayOfWeekFormatter } from "../../../../libs/date-picker-localization";

function Component({ open, onClose, currentRange, setRange }) {
  const i18n = useI18n();
  const [from, setFrom] = useState(currentRange.from);
  const [to, setTo] = useState(currentRange.to);
  const handleApplyClick = () => {
    setRange(from, to);
    onClose();
  };
  const handleClose = (...args) => onClose(...args);
  const handleFromChange = date => setFrom(date);
  const handleToChange = date => setTo(date);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{i18n.t("key_performance_indicators.date_range_dialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{i18n.t("key_performance_indicators.date_range_dialog.description")}</DialogContentText>
        <FormControl>
          <DateProvider excludeAdpaterLocale>
            <DatePicker
              dayOfWeekFormatter={dayOfWeekFormatter(i18n)}
              variant="inline"
              format={DATE_FORMAT}
              margin="normal"
              label={i18n.t("key_performance_indicators.date_range_dialog.from")}
              value={from}
              onChange={handleFromChange}
              KeyboardButtonProps={{
                "aria-label": i18n.t("key_performance_indicators.date_range_dialog.aria-labels.from")
              }}
            />
            <DatePicker
              dayOfWeekFormatter={dayOfWeekFormatter(i18n)}
              variant="inline"
              format={DATE_FORMAT}
              margin="normal"
              label={i18n.t("key_performance_indicators.date_range_dialog.to")}
              value={to}
              onChange={handleToChange}
              KeyboardButtonProps={{
                "aria-label": i18n.t("key_performance_indicators.date_range_dialog.aria-labels.to")
              }}
            />
          </DateProvider>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button id="key_performance_indicators.date_range_dialog.apply" onClick={handleApplyClick}>
          {i18n.t("key_performance_indicators.date_range_dialog.apply")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Component.displayName = "DateRangeDialog";

Component.propTypes = {
  currentRange: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date)
  }),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  setRange: PropTypes.func
};

export default Component;
