import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import styles from "./styles.css";

const PageContainer = ({ children, twoCol }) => {
  const css = makeStyles(styles)();

  if (twoCol) {
    return <div className={css.twoCol}>{children}</div>;
  }

  return (
    <div className={css.root}>
      <div className={css.wrap}>{children}</div>
    </div>
  );
};

PageContainer.displayName = "PageContainer";

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  twoCol: PropTypes.bool
};

export default PageContainer;
