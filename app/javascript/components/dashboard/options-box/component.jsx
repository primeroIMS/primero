import { Card, CardHeader, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import makeStyles from "@material-ui/styles/makeStyles";
import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";

const OptionsBox = ({ title, action, children, to, flat }) => {
  const css = makeStyles(styles)();

  return (
    <Card className={css.card} elevation={flat ? 0 : 3}>
      <CardHeader
        action={action}
        title={
          typeof to !== "undefined" ? (
            <Link to={to} className={css.cardLink}>
              {title}
            </Link>
          ) : (
            title
          )
        }
        className={css.title}
      />
      <CardContent className={css.content}>{children}</CardContent>
    </Card>
  );
};

OptionsBox.displayName = "OptionsBox";

OptionsBox.propTypes = {
  action: PropTypes.node,
  children: PropTypes.node,
  flat: PropTypes.bool,
  title: PropTypes.string,
  to: PropTypes.node
};

export default OptionsBox;
