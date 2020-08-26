import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { useI18n } from "../../i18n";
import DisableOffline from "../../disable-offline";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

import styles from "./styles.css";

const Actions = ({ handleSave, handleClear }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const showSave = handleSave && (
    <DisableOffline button>
      <ActionButton
        text={i18n.t("filters.save_filters")}
        type={ACTION_BUTTON_TYPES.default}
        isTransparent
        rest={{
          "aria-label": i18n.t("filters.save_filters"),
          onClick: handleSave,
          variant: "outlined"
        }}
      />
    </DisableOffline>
  );

  return (
    <div className={css.actionButtons}>
      <DisableOffline button>
        <ActionButton
          text={i18n.t("filters.apply_filters")}
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            "aria-label": i18n.t("filters.apply_filters"),
            type: "submit"
          }}
        />
      </DisableOffline>
      {showSave}
      <DisableOffline button>
        <ActionButton
          text={i18n.t("filters.clear_filters")}
          type={ACTION_BUTTON_TYPES.default}
          isTransparent
          rest={{
            "aria-label": i18n.t("filters.clear_filters"),
            onClick: handleClear,
            variant: "outlined"
          }}
        />
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
