// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Select, MenuItem } from "@mui/material";

import css from "../styles.css";

function Component({ handleSelectedField, options, selectedField = "" }) {
  const isOnlyOneDateFieldOption = Object.keys?.(options)?.length === 1;

  return (
    <div className={css.dateInput}>
      {isOnlyOneDateFieldOption ? (
        <input type="hidden" value={options[0].id} name="selectedField" />
      ) : (
        <Select fullWidth value={selectedField} onChange={handleSelectedField} variant="outlined">
          {options?.map(option => (
            <MenuItem value={option.id} key={option.id}>
              {option.display_name}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
}

Component.displayName = "FieldSelect";

Component.propTypes = {
  handleSelectedField: PropTypes.func,
  options: PropTypes.array,
  selectedField: PropTypes.string
};

export default Component;
