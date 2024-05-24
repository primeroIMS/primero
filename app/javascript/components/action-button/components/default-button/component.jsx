// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress, Tooltip } from "@material-ui/core";
import clsx from "clsx";

import ButtonText from "../../../button-text";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({
  id,
  icon,
  cancel,
  isTransparent,
  pending,
  text,
  outlined,
  keepTextOnMobile,
  tooltip,
  rest,
  ...options
}) => {
  const renderIcon = icon || null;
  const isPending = Boolean(pending);
  const renderLoadingIndicator = isPending && <CircularProgress size={24} className={css.buttonProgress} />;
  const renderContent = !renderIcon ? <>{text}</> : <ButtonText text={text} keepTextOnMobile={keepTextOnMobile} />;

  const spanClasses = clsx({ [css.isDisabled]: rest.disabled || isPending });
  const classes = clsx({
    [css.defaultActionButton]: renderIcon,
    [css.isTransparent]: isTransparent,
    [rest.className]: Boolean(rest.className)
  });

  const conditionalOptions = {
    ...(cancel && { variant: "text" })
  };

  const Parent = tooltip ? Tooltip : Fragment;

  return (
    <Parent {...(tooltip ? { title: tooltip } : {})}>
      <span className={spanClasses}>
        <Button
          id={id}
          className={classes}
          startIcon={renderIcon}
          variant="contained"
          disableElevation
          disabled={isPending}
          color="primary"
          {...rest}
          {...conditionalOptions}
          {...options}
        >
          {renderContent}
        </Button>
        {renderLoadingIndicator}
      </span>
    </Parent>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  cancel: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  id: PropTypes.string.isRequired,
  isTransparent: PropTypes.bool,
  keepTextOnMobile: PropTypes.bool,
  outlined: PropTypes.bool,
  pending: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string,
  tooltip: PropTypes.string
};

export default Component;
