// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Select, MenuItem } from "@mui/material";

import css from "../styles.css";

const Component = ({ handleSelectedField, options, selectedField }) => {
  return (
    <div className={css.dateInput}>
      <Select fullWidth value={selectedField} onChange={handleSelectedField} variant="outlined">
        {options?.map(option => (
          <MenuItem value={option.id} key={option.id}>
            {option.display_name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

Component.displayName = "FieldSelect";

Component.propTypes = {
  handleSelectedField: PropTypes.func,
  options: PropTypes.array,
  selectedField: PropTypes.string
};

export default Component;
