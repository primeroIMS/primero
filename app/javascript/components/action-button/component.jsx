import PropTypes from "prop-types";

import { useApp } from "../application";

import { buttonType } from "./utils";
import { NAME, ACTION_BUTTON_TYPES } from "./constants";

const Component = ({
  icon,
  cancel,
  isTransparent,
  pending,
  text,
  type,
  outlined,
  keepTextOnMobile,
  tooltip,
  rest,
  ...options
}) => {
  const { disabledApplication } = useApp();
  const ButtonType = buttonType(type);
  const isDisabled = disabledApplication && { disabled: disabledApplication };
  const isPending = Boolean(pending);

  const { hide, ...restBtnProps } = rest;

  if (hide) {
    return null;
  }

  return (
    <ButtonType
      icon={icon}
      cancel={cancel}
      isTransparent={isTransparent}
      pending={isPending}
      rest={{ ...restBtnProps, ...isDisabled }}
      outlined={outlined}
      text={text}
      tooltip={tooltip}
      keepTextOnMobile={keepTextOnMobile}
      {...options}
    />
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  outlined: false,
  rest: {},
  type: ACTION_BUTTON_TYPES.default
};

Component.propTypes = {
  cancel: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  isTransparent: PropTypes.bool,
  keepTextOnMobile: PropTypes.bool,
  outlined: PropTypes.bool,
  pending: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string,
  tooltip: PropTypes.string,
  type: PropTypes.string
};

export default Component;
