import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { Box } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { useI18n } from "components/i18n";
import { SelectFilter } from "components/filters-builder/filter-controls/select";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

const DatesRange = ({ recordType, props, fromDate, toDate, setDate }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { field_name: fieldName, options } = props;

  return (
    <div className={css.root}>
      {options && Object.keys(options).length > 0 ? (
        <SelectFilter recordType={recordType} props={props} isDate />
      ) : null}
      <Box className={css.datesContainer}>
        <DatePicker
          margin="normal"
          id="mui-pickers-date-from"
          format="dd-MMM-yyyy"
          className={css.dates}
          label={i18n.t(`fields.date_range.from`)}
          value={fromDate}
          onChange={date => setDate({ fieldName, from: date }, recordType)}
        />
        <DatePicker
          margin="normal"
          id="mui-pickers-date-to"
          format="dd-MMM-yyyy"
          className={css.dates}
          label={i18n.t(`fields.date_range.to`)}
          value={toDate}
          onChange={date => setDate({ fieldName, to: date }, recordType)}
        />
      </Box>
    </div>
  );
};

DatesRange.propTypes = {
  recordType: PropTypes.string.isRequired,
  props: PropTypes.object,
  options: PropTypes.object,
  field_name: PropTypes.string,
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  setDate: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  fromDate: selectors.getFromDate(state, obj.props, obj.recordType),
  toDate: selectors.getToDate(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setDate: actions.setDate
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatesRange);
