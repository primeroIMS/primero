import React from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import TransitionActions from "../components/menu-actions";
import TransitionStatus from "../TransitionStatus";
import { useI18n } from "../../i18n";
import { REFERRAL_SUMMARY_NAME } from "../constants";

const Summary = ({ transition, classes, showMode, recordType }) => {
  const i18n = useI18n();
  const transitionStatus = transition.status ? (
    <Grid item md={3} xs={3} className={classes.status}>
      <TransitionStatus status={transition.status} />
      <TransitionActions
        classes={classes}
        transition={transition}
        showMode={showMode}
        recordType={recordType}
      />
    </Grid>
  ) : null;

  return (
    <Grid container spacing={2}>
      <Grid item md={9} xs={9}>
        <div className={classes.wrapper}>
          <div className={classes.titleHeader}>
            {i18n.t("transition.type.referral")}
          </div>

          {/* TODO: The date should be localized */}
          <div className={classes.date}>
            {format(new Date(transition.created_at), "MMM dd,yyyy")}
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
