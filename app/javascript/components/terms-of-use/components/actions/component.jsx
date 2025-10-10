// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

function Component({ css, handleAccept, handleCancel, handleViewTerms, hasViewedTerms, updatingTermsOfUse }) {
  return (
    <div className={css.actions}>
      <ActionButton
        id="terms-of-use-cancel"
        icon={<ClearIcon />}
        text="buttons.cancel"
        type={ACTION_BUTTON_TYPES.default}
        cancel
        isTransparent
        rest={{
          onClick: handleCancel
        }}
      />
      <ActionButton
        id="terms-of-use-view"
        icon={<VisibilityIcon />}
        text="terms_of_use.view_button"
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleViewTerms
        }}
      />
      <ActionButton
        id="terms-of-use-accept"
        icon={<CheckIcon />}
        text="buttons.accept"
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleAccept,
          pending: updatingTermsOfUse,
          disabled: !hasViewedTerms || updatingTermsOfUse
        }}
      />
    </div>
  );
}

Component.displayName = "TermsOfUseActions";

Component.propTypes = {
  css: PropTypes.object,
  handleAccept: PropTypes.func,
  handleCancel: PropTypes.func,
  handleViewTerms: PropTypes.func,
  hasViewedTerms: PropTypes.bool,
  updatingTermsOfUse: PropTypes.bool
};

export default Component;
