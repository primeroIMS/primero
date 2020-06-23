import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Box } from "@material-ui/core";

import { useThemeHelper } from "../../../libs";
import styles from "../styles.css";

const PageHeading = ({
  title,
  prefixAction,
  children,
  whiteHeading,
  mobileHeading
}) => {
  const { css, mobileDisplay } = useThemeHelper(styles);

  const toolbarClass =
    mobileDisplay && mobileHeading ? css.toolbarMobile : css.toolbar;

  return (
    <AppBar
      position="sticky"
      classes={{ root: whiteHeading ? css.appBarWhite : css.appBar }}
      elevation={0}
      color="inherit"
    >
      <Toolbar className={toolbarClass}>
        {prefixAction && (
          <Box>
            <div>{prefixAction()}</div>
          </Box>
        )}
        <h1 className={css.heading}>{title}</h1>
        <div>{children}</div>
      </Toolbar>
    </AppBar>
  );
};

PageHeading.displayName = "PageHeading";

PageHeading.defaultProps = {
  mobileHeading: false
};

PageHeading.propTypes = {
  children: PropTypes.node,
  mobileHeading: PropTypes.bool,
  prefixAction: PropTypes.func,
  title: PropTypes.string.isRequired,
  whiteHeading: PropTypes.bool
};

export default PageHeading;
