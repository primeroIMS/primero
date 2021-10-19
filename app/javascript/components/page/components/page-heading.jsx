import PropTypes from "prop-types";
import { AppBar, Toolbar } from "@material-ui/core";
import isString from "lodash/isString";
import clsx from "clsx";

import css from "../styles.css";

const PageHeading = ({ title, prefixComponent, prefixAction, children, noElevation = false, noPadding = false }) => {
  const toolbarClasses = clsx(css.toolbar, { [css.noPadding]: noPadding });
  const appBarClasses = clsx(css.appBar, { [css.appBarBorder]: !noElevation });

  return (
    <AppBar position="sticky" classes={{ root: appBarClasses }} elevation={noElevation ? 0 : 2} color="inherit">
      <Toolbar classes={{ root: toolbarClasses }}>
        {prefixAction && (
          <div>
            <div>{prefixAction()}</div>
          </div>
        )}
        {isString(title) ? <h1 className={css.title}>{title}</h1> : <div className={css.titleContainer}>{title}</div>}
        <div className={css.actions}>{children}</div>
        {prefixComponent && (
          <>
            <div className={css.break} />
            <div>{prefixComponent}</div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

PageHeading.displayName = "PageHeading";

PageHeading.propTypes = {
  children: PropTypes.node,
  noElevation: PropTypes.bool,
  noPadding: PropTypes.bool,
  prefixAction: PropTypes.func,
  prefixComponent: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
};

export default PageHeading;
