// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";
import clsx from "clsx";

import { useI18n } from "../i18n";

import { TRANSITION_STATUS_NAME as NAME } from "./constants";
import css from "./styles.css";

function TransitionStatus({ status }) {
  const i18n = useI18n();

  const classes = clsx(css.chip, css[status]);

  return (
    <div className={css.transtionStatus}>
      <Chip label={i18n.t(`transition.status.${status}`)} className={classes} size="small" />
    </div>
  );
}

TransitionStatus.displayName = NAME;

TransitionStatus.propTypes = {
  status: PropTypes.string
};

export default TransitionStatus;
