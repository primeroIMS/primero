import React from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../i18n";
import TransitionStatus from "../TransitionStatus";
import TransferActionMenu from "./transfer-action-menu";
import styles from "./styles.css";

const TransferSummary = ({
  transition,
  classes,
  currentUser,
  showMode
}) => {
  const css = makeStyles(styles)();
  const showTransferApproval = transition
    && transition.transitioned_to === currentUser
    && transition.status === "in_progress"
    && showMode;
  const i18n = useI18n();
  const transitionStatus = transition.status ? (
    <Grid item md={2} xs={10}>
      <TransitionStatus status={transition.status} />
    </Grid>
  ) : null;

  const transferApproval = showTransferApproval ? (
    <Grid item md={1} xs={10} className={css.transferMenuIconContainer}>
      <TransferActionMenu transition={transition} />
    </Grid>
  ) : null;
  const itemWidth = showTransferApproval ? 9 : 10;
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item md={itemWidth} xs={10}>
        <div className={classes.wrapper}>
          <div className={classes.titleHeader}>
            {i18n.t("transition.type.transfer")}
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

TransferSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  transition: PropTypes.object.isRequired,
  currentUser: PropTypes.string,
  showMode: PropTypes.bool
};

export default TransferSummary;
