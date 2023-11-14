// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { AppBar, Collapse, Divider, Toolbar } from "@material-ui/core";
import isString from "lodash/isString";
import clsx from "clsx";
import { useCallback, useState } from "react";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import css from "../styles.css";

const PageHeading = ({
  title,
  prefixComponent,
  prefixAction,
  children,
  icon,
  noElevation = false,
  noPadding = false,
  controls,
  titleSecondary
}) => {
  const toolbarClasses = clsx(css.toolbar, { [css.noPadding]: noPadding });
  const appBarClasses = clsx(css.appBar, { [css.appBarBorder]: !noElevation });
  const titleClasses = clsx(css.title, { [css.titleWithSecondary]: titleSecondary });
  const [controlsToggle, setControlsToggle] = useState(false);

  const handleControlsToggle = useCallback(() => {
    setControlsToggle(!controlsToggle);
  }, [controlsToggle]);

  const handleCloseControls = useCallback(() => {
    setControlsToggle(false);
  }, []);

  return (
    <AppBar position="sticky" classes={{ root: appBarClasses }} elevation={noElevation ? 0 : 2} color="inherit">
      <Toolbar classes={{ root: toolbarClasses }}>
        {prefixAction && (
          <div>
            <div>{prefixAction()}</div>
          </div>
        )}
        <div className={css.titleContainer}>
          {isString(title) ? <h1 className={titleClasses}>{title}</h1> : <div>{title}</div>}
          {titleSecondary && titleSecondary}
        </div>
        <div className={css.actions}>{children}</div>
        {prefixComponent && (
          <>
            <div className={css.break} />
            <div>{prefixComponent}</div>
          </>
        )}
        {controls && (
          <ActionButton
            id="toolbar-controls"
            onClick={handleControlsToggle}
            type={ACTION_BUTTON_TYPES.icon}
            icon={icon}
          />
        )}
      </Toolbar>
      {controls && (
        <Collapse in={controlsToggle}>
          <Toolbar>
            <Divider />
            <div className={css.controls}>{controls(handleCloseControls)}</div>
          </Toolbar>
        </Collapse>
      )}
    </AppBar>
  );
};

PageHeading.displayName = "PageHeading";

PageHeading.propTypes = {
  children: PropTypes.node,
  controls: PropTypes.node,
  icon: PropTypes.node,
  noElevation: PropTypes.bool,
  noPadding: PropTypes.bool,
  prefixAction: PropTypes.func,
  prefixComponent: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  titleSecondary: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default PageHeading;
