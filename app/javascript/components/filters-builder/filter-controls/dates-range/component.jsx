import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { useI18n } from "components/i18n";
import { SelectFilter } from "components/filters-builder/filter-controls/select";
import styles from "./styles.css";

const DatesRange = ({ recordType, props }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { options } = props;
  const { values } = options;
  const [selectedFromDate, setSelectedFromDate] = React.useState(new Date());
  const [selectedToDate, setSelectedToDate] = React.useState(new Date());

  return (
    <div className={css.root}>
      {values && values.length > 0 ? (
        <SelectFilter recordType={recordType} props={props} />
      ) : null}
      <Box className={css.datesContainer}>
        <DatePicker
          margin="normal"
          id="mui-pickers-date-from"
          format="dd-MMM-yyyy"
          className={css.dates}
          label={i18n.t(`fields.date_range.from`)}
          value={selectedFromDate}
          onChange={date => setSelectedFromDate(date)}
        />
        <DatePicker
          margin="normal"
          id="mui-pickers-date-to"
          format="dd-MMM-yyyy"
          className={css.dates}
          label={i18n.t(`fields.date_range.to`)}
          value={selectedToDate}
          onChange={date => setSelectedToDate(date)}
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
