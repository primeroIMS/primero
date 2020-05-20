import { Card, CardHeader, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import makeStyles from "@material-ui/styles/makeStyles";
import PropTypes from "prop-types";
import React from "react";

import LoadingIndicator from "../../loading-indicator";
import DisableOffline from "../../disable-offline";
import { ConditionalWrapper } from "../../../libs";

import styles from "./styles.css";

const OptionsBox = ({
  title,
  action,
  children,
  to,
  flat,
  overlay,
  type,
  loading,
  errors,
  hasData
}) => {
  const css = makeStyles(styles)();

  const loadingIndicatorProps = {
    overlay,
    type,
    loading,
    errors,
    hasData
  };

  const cardTitle = title && (
    <CardHeader
      action={action}
      title={
        to ? (
          <Link to={to} className={css.cardLink}>
            {title}
          </Link>
        ) : (
          title
        )
      }
      className={css.title}
    />
  );

  return (
    <Card className={css.card} elevation={flat ? 0 : 3}>
      <ConditionalWrapper condition={!flat} wrapper={DisableOffline}>
        <>
          {cardTitle}
          <LoadingIndicator {...loadingIndicatorProps}>
            <CardContent className={css.content}>{children}</CardContent>
          </LoadingIndicator>
        </>
      </ConditionalWrapper>
    </Card>
  );
};

OptionsBox.displayName = "OptionsBox";

OptionsBox.defaultProps = {
  hasData: true,
  type: ""
};

OptionsBox.propTypes = {
  action: PropTypes.node,
  children: PropTypes.node,
  errors: PropTypes.bool,
  flat: PropTypes.bool,
  hasData: PropTypes.bool,
  loading: PropTypes.bool,
  overlay: PropTypes.bool,
  title: PropTypes.string,
  to: PropTypes.node,
  type: PropTypes.string
};

export default OptionsBox;
