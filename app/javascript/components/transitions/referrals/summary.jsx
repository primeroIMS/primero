import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import TransitionStatus from "../TransitionStatus";
import { useI18n } from "../../i18n";
import { REFERRAL_SUMMARY_NAME } from "../constants";
import { currentUser } from "../../user/selectors";

import ReferralActionMenu from "./referral-action-menu";
import styles from "./styles.css";
import { IN_PROGRESS } from "./constants";

const Summary = ({ transition, classes, showMode, recordType }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const currentUsername = useSelector(state => currentUser(state));
  const showReferralMenu = transition &&
    transition.transitioned_to === currentUsername &&
    transition.status === IN_PROGRESS &&
    showMode;
  const transitionStatus = transition.status ? (
    <Grid item md={2} xs={4}>
      <TransitionStatus status={transition.status} />
    </Grid>
  ) : null;
  console.log('showReferralMenu:::', transition, transition && transition.transitioned_to === currentUsername && transition.status === IN_PROGRESS && showMode, showReferralMenu);
  const itemWidth = showReferralMenu ? 9 : 10;
  const transferApproval = showReferralMenu ? (
    <Grid item md={1} xs={10} className={css.referralMenuIconContainer}>
      <ReferralActionMenu transition={transition} recordType={recordType} />
    </Grid>
  ) : null;

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item md={itemWidth} xs={8}>
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
      {transferApproval}
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
