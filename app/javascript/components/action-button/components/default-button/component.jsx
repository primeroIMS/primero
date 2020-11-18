import React from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import ButtonText from "../../../button-text";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ icon, isCancel, isTransparent, pending, text, outlined, keepTextOnMobile, rest }) => {
  const css = makeStyles(styles)();
  const renderIcon = icon || null;
  const isPending = Boolean(pending);
  const renderLoadingIndicator = isPending && <CircularProgress size={24} className={css.buttonProgress} />;
  const renderContent = !renderIcon ? <>{text}</> : <ButtonText text={text} keepTextOnMobile={keepTextOnMobile} />;

  const classes = clsx({
    [css.defaultActionButton]: renderIcon,
    [css.isTransparent]: isTransparent,
    [css.isCancel]: isCancel,
    [css.onlyText]: !renderIcon,
    [css.outlined]: outlined,
    [rest.className]: Boolean(rest.className)
  });

  return (
    <>
      <Button className={classes} startIcon={renderIcon} disabled={isPending} {...rest}>
        {renderContent}
      </Button>
      {renderLoadingIndicator}
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  icon: PropTypes.object,
  isCancel: PropTypes.bool,
  isTransparent: PropTypes.bool,
  keepTextOnMobile: PropTypes.bool,
  outlined: PropTypes.bool,
  pending: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string
};

export default Component;
