// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import TransitionActions from "../components/menu-actions";
import TransitionStatus from "../TransitionStatus";
import { useI18n } from "../../i18n";
import { REFERRAL_SUMMARY_NAME } from "../constants";
import DateTransitionsSummary from "../components/date-transitions-summary";

const Summary = ({ transition, classes, showMode, recordType }) => {
  const i18n = useI18n();
  const transitionStatus = transition.status ? (
    <Grid item md={3} xs={8} className={classes.status}>
      <TransitionStatus status={transition.status} />
      <TransitionActions classes={classes} transition={transition} showMode={showMode} recordType={recordType} />
    </Grid>
  ) : null;

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item md={9} xs={4}>
        <div className={classes.wrapper}>
          <DateTransitionsSummary value={transition.created_at} />
          <div className={classes.titleHeader}>
            {i18n.t(`transition.type.${transition.remote ? "external_referral" : "referral"}`)}
          </div>
        </div>
      </Grid>
      {transitionStatus}
    </Grid>
  );
};

Summary.displayName = REFERRAL_SUMMARY_NAME;

Summary.propTypes = {
  classes: PropTypes.object.isRequired,
  recordType: PropTypes.string,
  showMode: PropTypes.bool,
  transition: PropTypes.object.isRequired
};

export default Summary;
