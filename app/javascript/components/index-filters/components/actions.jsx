// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import DisableOffline from "../../disable-offline";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

import css from "./styles.css";

const Actions = ({ handleSave, handleClear }) => {
  const showSave = handleSave && (
    <DisableOffline button>
      <ActionButton
        text="filters.save_filters"
        type={ACTION_BUTTON_TYPES.default}
        variant="outlined"
        fullWidth
        rest={{
          onClick: handleSave
        }}
      />
    </DisableOffline>
  );

  return (
    <div className={css.actionButtons}>
      <DisableOffline button>
        <ActionButton
          text="filters.apply_filters"
          type={ACTION_BUTTON_TYPES.default}
          fullWidth
          rest={{ type: "submit" }}
        />
      </DisableOffline>
      {showSave}
      <DisableOffline button>
        <ActionButton
          text="filters.clear_filters"
          type={ACTION_BUTTON_TYPES.default}
          variant="outlined"
          fullWidth
          rest={{
            onClick: handleClear
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
