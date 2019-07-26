import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import styles from "./styles.css";

const PageHeading = ({ title }) => {
  const css = makeStyles(styles)();

  return <h1 className={css.heading}>{title}</h1>;
};

PageHeading.propTypes = {
  title: PropTypes.string.isRequired
};

export default PageHeading;
