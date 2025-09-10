// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import isString from "lodash/isString";

import { useApp } from "../application/use-app";
import useSystemStrings, { ACTION_BUTTON } from "../application/use-system-strings";

import { buttonType } from "./utils";
import { NAME, ACTION_BUTTON_TYPES } from "./constants";

function Component({
  id = null,
  icon,
  cancel,
  isTransparent,
  pending,
  text,
  type = ACTION_BUTTON_TYPES.default,
  outlined = false,
  keepTextOnMobile,
  tooltip,
  noTranslate = false,
  rest = {},
  disabled,
  ...options
}) {
  const { disabledApplication } = useApp();
  const { label } = useSystemStrings(ACTION_BUTTON);
  const ButtonType = buttonType(type);
  const isDisabled = (disabledApplication || disabled) && { disabled: disabledApplication || disabled };
  const isPending = Boolean(pending);
  const buttonID = id || text;
  const buttonText = !noTranslate && isString(text) ? label(text) : text;

  const { hide, ...restBtnProps } = rest;

  if (hide) {
    return null;
  }

  return (
    <ButtonType
      data-testid="action-button"
      id={buttonID}
      icon={icon}
      cancel={cancel}
      isTransparent={isTransparent}
      pending={isPending}
      rest={{ ...restBtnProps, ...isDisabled }}
      outlined={outlined}
      text={buttonText}
      tooltip={tooltip}
      keepTextOnMobile={keepTextOnMobile}
      role="button"
      {...options}
    />
  );
}

Component.displayName = NAME;

Component.propTypes = {
  cancel: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  id: PropTypes.string,
  isTransparent: PropTypes.bool,
  keepTextOnMobile: PropTypes.bool,
  noTranslate: PropTypes.bool,
  outlined: PropTypes.bool,
  pending: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string,
  tooltip: PropTypes.string,
  type: PropTypes.string
};

export default Component;
