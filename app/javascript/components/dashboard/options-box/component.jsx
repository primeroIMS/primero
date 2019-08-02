import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const OptionsBox = ({ title, action, children }) => {
  const css = makeStyles(styles)();

  return (
    <Card className={css.card} elevation={3}>
      <CardHeader action={action} title={title} className={css.title} />
      <CardContent className={css.content}>{children}</CardContent>
    </Card>
  );
};

OptionsBox.propTypes = {
  title: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node
};

export default OptionsBox;
