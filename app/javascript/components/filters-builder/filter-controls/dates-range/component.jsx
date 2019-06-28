import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField } from "@material-ui/core";
import { SelectFilter } from "components/filters-builder/filter-controls/select";
import styles from "./styles.css";

const DatesRange = ({ props }) => {
  const css = makeStyles(styles)();
  const { options } = props;
  const { values } = options;
  return (
    <div className={css.root}>
      {values && values.length > 0 ? <SelectFilter props={props} /> : null}
      <Box className={css.datesContainer}>
        <TextField
          id="date"
          label="From"
          type="date"
          defaultValue="2017-05-24"
          className={css.dates}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="date"
          label="To"
          type="date"
          defaultValue="2017-05-24"
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
  props: PropTypes.object,
  options: PropTypes.object
};

export default DatesRange;
