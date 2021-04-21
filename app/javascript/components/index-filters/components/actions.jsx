import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { useI18n } from "../../i18n";
import DisableOffline from "../../disable-offline";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Actions = ({ handleSave, handleClear }) => {
  const css = useStyles();
  const i18n = useI18n();

  const showSave = handleSave && (
    <DisableOffline button>
      <ActionButton
        text={i18n.t("filters.save_filters")}
        type={ACTION_BUTTON_TYPES.default}
        isTransparent
        rest={{
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
          rest={{ type: "submit" }}
        />
      </DisableOffline>
      {showSave}
      <DisableOffline button>
        <ActionButton
          text={i18n.t("filters.clear_filters")}
          type={ACTION_BUTTON_TYPES.default}
          isTransparent
          rest={{
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
