import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import styles from "./styles.css";

const PageHeading = ({ title, prefixAction, children, whiteHeading }) => {
  const css = makeStyles(styles)();

  return (
    <AppBar
      position="sticky"
      classes={{ root: whiteHeading ? css.appBarWhite : css.appBar }}
      elevation={0}
      color="inherit"
    >
      <Toolbar className={css.toolbar}>
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

PageHeading.propTypes = {
  whiteHeading: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  prefixAction: PropTypes.func
};

export default PageHeading;
