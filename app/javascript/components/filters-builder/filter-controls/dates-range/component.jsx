import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField } from "@material-ui/core";
import { SelectFilter } from "components/filters-builder/filter-controls/select";
import styles from "./styles.css";

const DatesRange = ({ recordType, props }) => {
  const css = makeStyles(styles)();
  const { options } = props;
  const { values } = options;
  return (
    <div className={css.root}>
      {values && values.length > 0 ? (
        <SelectFilter recordType={recordType} props={props} />
      ) : null}
      <Box className={css.datesContainer}>
        <TextField
          id="date"
          label="From"
          type="date"
          autoComplete="off"
          className={css.dates}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="date"
          label="To"
          type="date"
          autoComplete="off"
          className={css.dates}
          InputLabelProps={{
            shrink: true
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
