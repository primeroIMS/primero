import PropTypes from "prop-types";

import { useApp } from "../application";

import { buttonType } from "./utils";
import { NAME, ACTION_BUTTON_TYPES } from "./constants";

const Component = ({
  icon,
  isCancel,
  isTransparent,
  pending,
  text,
  type,
  outlined,
  keepTextOnMobile,
  tooltip,
  rest
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
      isCancel={isCancel}
      isTransparent={isTransparent}
      pending={isPending}
      rest={{ ...restBtnProps, ...isDisabled }}
      outlined={outlined}
      text={text}
      tooltip={tooltip}
      keepTextOnMobile={keepTextOnMobile}
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
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  isCancel: PropTypes.bool,
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
