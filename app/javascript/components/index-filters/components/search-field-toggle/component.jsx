// Copyright (c) 2014 - 2026 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import css from "../filter-types/styles.css";

function Component({ handleChange, value }) {
  const SEARCH_OPTIONS = [
    { id: "id_search", label: "ID Fields" },
    { id: "phonetic", label: "Name Fields" },
    { id: "phone_number", label: "Phone No." }
  ];

  return (
    <>
      <p>Search By</p>
      <ToggleButtonGroup
        color="primary"
        size="small"
        data-testid="search-field-toggle"
        onChange={handleChange}
        value={value}
        classes={{ root: css.toggleContainer }}
      >
        {SEARCH_OPTIONS.map(option => {
          return (
            <ToggleButton value={option.id} classes={{ root: css.toggleButton, selected: css.toggleButtonSelected }}>
              {option.label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </>
  );
}

Component.displayName = "SearchFieldToggle";

Component.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default Component;
