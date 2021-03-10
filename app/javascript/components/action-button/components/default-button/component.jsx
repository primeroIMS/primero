import { Fragment } from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import ButtonText from "../../../button-text";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ icon, isCancel, isTransparent, pending, text, outlined, keepTextOnMobile, tooltip, rest }) => {
  const css = useStyles();
  const renderIcon = icon || null;
  const isPending = Boolean(pending);
  const renderLoadingIndicator = isPending && <CircularProgress size={24} className={css.buttonProgress} />;
  const renderContent = !renderIcon ? <>{text}</> : <ButtonText text={text} keepTextOnMobile={keepTextOnMobile} />;

  const spanClasses = clsx({ [css.isDisabled]: [rest.disabled] });
  const classes = clsx({
    [css.defaultActionButton]: renderIcon,
    [css.isTransparent]: isTransparent,
    [css.isCancel]: isCancel,
    [css.onlyText]: !renderIcon,
    [css.outlined]: outlined,
    [rest.className]: Boolean(rest.className)
  });

  const Parent = tooltip ? Tooltip : Fragment;

  return (
    <Parent {...(tooltip ? { title: tooltip } : {})}>
      <span className={spanClasses}>
        <Button className={classes} startIcon={renderIcon} disabled={isPending} {...rest}>
          {renderContent}
        </Button>
        {renderLoadingIndicator}
      </span>
    </Parent>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  isCancel: PropTypes.bool,
  isTransparent: PropTypes.bool,
  keepTextOnMobile: PropTypes.bool,
  outlined: PropTypes.bool,
  pending: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string,
  tooltip: PropTypes.string
};

export default Component;
