import React from "react";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";
import clsx from "clsx";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../i18n";

import styles from "./styles.css";

const TransitionStatus = ({ status }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <div className={css.transtionStatus}>
      <Chip
        label={i18n.t(`transition.status.${status}`)}
        className={clsx(css.chip, css[status])}
        size="small"
      />
    </div>
  );
};

TransitionStatus.propTypes = {
  status: PropTypes.string
};

export default TransitionStatus;
