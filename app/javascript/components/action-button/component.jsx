import React from "react";
import PropTypes from "prop-types";

import { useApp } from "../application";

import { buttonType } from "./utils";
import { NAME, ACTION_BUTTON_TYPES } from "./constants";

const Component = ({ icon, isCancel, isTransparent, pending, text, type, outlined, keepTextOnMobile, rest }) => {
  const { disabledApplication } = useApp();
  const ButtonType = buttonType(type);

  return (
    <>
      <ButtonType
        icon={icon}
        isCancel={isCancel}
        isTransparent={isTransparent}
        pending={pending}
        rest={{ ...rest, disabled: disabledApplication }}
        outlined={outlined}
        text={text}
        keepTextOnMobile={keepTextOnMobile}
      />
    </>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  outlined: false,
  rest: {},
  type: ACTION_BUTTON_TYPES.default
};

Component.propTypes = {
  icon: PropTypes.object,
  isCancel: PropTypes.bool,
  isTransparent: PropTypes.bool,
  keepTextOnMobile: PropTypes.bool,
  outlined: PropTypes.bool,
  pending: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string,
  type: PropTypes.string
};

export default Component;
