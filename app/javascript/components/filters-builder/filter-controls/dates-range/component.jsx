import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useI18n } from "components/i18n";
import { SelectFilter } from "components/filters-builder/filter-controls/select";
import styles from "./styles.css";

const DatesRange = ({ recordType, props }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { options } = props;
  const { values } = options;
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  function handleDateChange(date) {
    setSelectedDate(date);
  }
  return (
    <div className={css.root}>
      {values && values.length > 0 ? (
        <SelectFilter recordType={recordType} props={props} />
      ) : null}
      <Box className={css.datesContainer}>
        <KeyboardDatePicker
          margin="normal"
          id="mui-pickers-date-from"
          label={i18n.t(`fields.date_range.from`)}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="mui-pickers-date-to"
          label={i18n.t(`fields.date_range.to`)}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </Box>
    </div>
  );
};

DatesRange.propTypes = {
  recordType: PropTypes.string.isRequired,
  props: PropTypes.object,
  options: PropTypes.object
};

export default DatesRange;
