// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { NAME } from "./constants";

const Component = ({ css, handleAccept, handleCancel, updatingCodeOfConduct, codeOfConductAccepted }) => {
  return (
    <div className={css.actions}>
      <ActionButton
        id="code-of-conduct-cancel"
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
        id="code-of-conduct-accept"
        icon={<CheckIcon />}
        text="buttons.accept"
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleAccept,
          pending: updatingCodeOfConduct,
          disabled: updatingCodeOfConduct || codeOfConductAccepted
        }}
      />
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  codeOfConductAccepted: PropTypes.bool,
  css: PropTypes.object,
  handleAccept: PropTypes.func,
  handleCancel: PropTypes.func,
  updatingCodeOfConduct: PropTypes.bool
};

export default Component;
