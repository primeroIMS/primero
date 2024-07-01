// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { FormControlLabel, Switch } from "@material-ui/core";

import { useI18n } from "../../../i18n";

import css from "./styles.css";

function Component({ handleChange, value = false }) {
  const i18n = useI18n();

  const label = i18n.t("navigation.phonetic_search.label");

  return (
    <FormControlLabel
      labelPlacement="end"
      control={
        <Switch
          classes={{
            checked: css.checked,
            track: css.track
          }}
          onChange={handleChange}
          checked={value}
        />
      }
      label={label}
      classes={{ root: css.label }}
    />
  );
}

Component.displayName = "SearchNameToggle";

Component.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.bool
};

export default Component;
