import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../i18n";
import DisableOffline from "../../disable-offline";

import styles from "./styles.css";

const Actions = ({ handleSave, handleClear }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const showSave = handleSave && (
    <DisableOffline>
      <Button onClick={handleSave} variant="outlined">
        {i18n.t("filters.save_filters")}
      </Button>
    </DisableOffline>
  );

  return (
    <div className={css.actionButtons}>
      <DisableOffline>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disableElevation
        >
          {i18n.t("filters.apply_filters")}
        </Button>
      </DisableOffline>
      {showSave}
      <DisableOffline>
        <Button onClick={handleClear} variant="outlined">
          {i18n.t("filters.clear_filters")}
        </Button>
      </DisableOffline>
    </div>
  );
};

Actions.propTypes = {
  handleClear: PropTypes.func.isRequired,
  handleSave: PropTypes.func
};

Actions.displayName = "Actions";

export default Actions;
