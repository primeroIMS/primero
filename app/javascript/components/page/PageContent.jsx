import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import styles from "./styles.css";

const PageContent = ({ children }) => {
  const css = makeStyles(styles)();

  return <div className={css.content}>{children}</div>;
};

PageContent.propTypes = {
  children: PropTypes.node
};

PageContent.displayName = "PageContent";

export default PageContent;
