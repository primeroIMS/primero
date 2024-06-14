// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import { Grid } from "@mui/material";

import { useI18n } from "../../i18n";
import TransitionStatus from "../TransitionStatus";
import TransitionActions from "../components/menu-actions";
import DateTransitionsSummary from "../components/date-transitions-summary";

function TransferSummary({ transition, classes, showMode, recordType }) {
  const i18n = useI18n();
  const transitionStatus = transition.status ? (
    <Grid item md={3} xs={3} className={classes.status}>
      <TransitionStatus status={transition.status} />
      <TransitionActions classes={classes} transition={transition} showMode={showMode} recordType={recordType} />
    </Grid>
  ) : null;

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item md={9} xs={9}>
        <div className={classes.wrapper}>
          <DateTransitionsSummary value={transition.created_at} />
          <div className={classes.titleHeader}>{i18n.t("transition.type.transfer")}</div>
        </div>
      </Grid>
      {transitionStatus}
    </Grid>
  );
}

TransferSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  recordType: PropTypes.string,
  showMode: PropTypes.bool,
  transition: PropTypes.object.isRequired
};

export default TransferSummary;
