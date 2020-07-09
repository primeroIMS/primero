import React from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import ButtonText from "../../../button-text";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ icon, isCancel, isTransparent, pending, text, rest }) => {
  const css = makeStyles(styles)();
  const renderIcon = icon || null;
  const renderLoadingIndicator = pending && (
    <CircularProgress size={24} className={css.buttonProgress} />
  );

  return (
    <>
      <Button
        className={clsx(css.defaultActionButton, {
          [css.isTransparent]: isTransparent,
          [css.isCancel]: isCancel
        })}
        startIcon={renderIcon}
        disabled={pending}
        {...rest}
      >
        <ButtonText text={text} />
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
  pending: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string
};

export default Component;
