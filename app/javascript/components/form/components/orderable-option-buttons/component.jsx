// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";

import css from "./styles.css";

function Component({ disabledAddAction, onAddOption, onClearDefault, showDefaultAction }) {
  return (
    <div className={css.optionsFieldActions}>
      <ActionButton
        id="add-another-options"
        icon={<AddIcon />}
        text="buttons.add_another_option"
        type={ACTION_BUTTON_TYPES.default}
        disabled={disabledAddAction}
        rest={{
          onClick: onAddOption
        }}
      />
      {showDefaultAction && (
        <ActionButton
          icon={<CloseIcon />}
          text="buttons.clear_default"
          type={ACTION_BUTTON_TYPES.default}
          cancel
          rest={{
            onClick: onClearDefault
          }}
        />
      )}
    </div>
  );
}

Component.displayName = "OrderableOptionButtons";

Component.propTypes = {
  disabledAddAction: PropTypes.bool,
  onAddOption: PropTypes.func,
  onClearDefault: PropTypes.func,
  showDefaultAction: PropTypes.bool
};

export default Component;
