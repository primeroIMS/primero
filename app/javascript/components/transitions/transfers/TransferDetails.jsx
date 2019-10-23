import React from "react";
import { useI18n } from "components/i18n";
import { Box, Divider, Grid, FormControlLabel } from "@material-ui/core";
import PropTypes from "prop-types";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Cancel from "@material-ui/icons/Cancel";
import TransitionUser from "../TransitionUser";

const TransferDetails = ({ transition, classes }) => {
  const i18n = useI18n();

  const renderRejected =
    transition.status === "rejected" ? (
      <Grid item md={12} xs={12}>
        <Box>
          <div className={classes.transtionLabel}>
            {i18n.t("transition.rejected")}
          </div>
          <div className={classes.transtionValue}>
            {transition.rejected_reason}
          </div>
        </Box>
      </Grid>
    ) : null;

  const renderIconValue = value => {
    return value ? (
      <CheckCircleIcon className={classes.successIcon} />
    ) : (
      <Cancel />
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <TransitionUser
          label="transition.recipient"
          transitionUser={transition.transitioned_to}
          classes={classes}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TransitionUser
          label="transition.assigned_by"
          transitionUser={transition.transitioned_by}
          classes={classes}
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <Box>
          <div className={classes.transtionLabel}>
            {i18n.t("transition.no_consent_share")}
          </div>
          <div className={classes.transtionIconValue}>
            <FormControlLabel
              control={renderIconValue(transition.consent_overridden)}
              label={
                <div className={classes.transtionValue}>
                  {i18n.t(
                    `transition.consent_overridden_value.${transition.consent_overridden}_label`
                  )}
                </div>
              }
            />
          </div>
        </Box>
      </Grid>
      <Grid item md={6} xs={12}>
        <Box>
          <div className={classes.transtionLabel}>
            {i18n.t("transition.individual_consent")}
          </div>
          <div className={classes.transtionIconValue}>
            <FormControlLabel
              control={renderIconValue(transition.consent_individual_transfer)}
              label={
                <div className={classes.transtionValue}>
                  {i18n.t(
                    `transition.consent_individual_transfer_value.${transition.consent_individual_transfer}_label`
                  )}
                </div>
              }
            />
          </div>
        </Box>
      </Grid>

      {renderRejected}
      <Grid item md={12} xs={12}>
        <Box>
          <Divider />
          <div className={classes.transtionLabel}>
            {i18n.t("transition.notes")}
          </div>
          <div className={classes.transtionValue}>{transition.notes}</div>
        </Box>
      </Grid>
    </Grid>
  );
};

TransferDetails.propTypes = {
  transition: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default TransferDetails;
