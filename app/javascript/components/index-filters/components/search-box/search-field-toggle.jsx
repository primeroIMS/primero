import { memo } from "react";
import PropTypes from "prop-types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import filterCss from "../filter-types/styles.css";
import { useI18n } from "../../../i18n";

function Component({ handleChange, value }) {
  const i18n = useI18n();
  const SEARCH_OPTIONS = [
    { id: "id_search", label: i18n.t("navigation.search_options.id_search") },
    { id: "phonetic", label: i18n.t("navigation.search_options.phonetic") },
    { id: "phone_number", label: i18n.t("navigation.search_options.phone_number") }
  ];

  return (
    <ToggleButtonGroup
      color="primary"
      size="small"
      data-testid="search-field-toggle"
      onChange={handleChange}
      value={value}
      classes={{ root: filterCss.toggleContainer }}
    >
      {SEARCH_OPTIONS.map(option => {
        return (
          <ToggleButton
            value={option.id}
            classes={{ root: filterCss.toggleButton, selected: filterCss.toggleButtonSelected }}
          >
            {option.label}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}

Component.displayName = "SearchFieldToggle";

Component.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default memo(Component);
