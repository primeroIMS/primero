import React from "react";
import { useI18n } from "components/i18n";
import { Box, Divider, Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import TransitionUser from "../TransitionUser";

const AssignmentsDetails = ({ transition, classes }) => {
  const i18n = useI18n();
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

AssignmentsDetails.propTypes = {
  transition: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default AssignmentsDetails;
