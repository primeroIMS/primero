import React from "react";
import { useI18n } from "components/i18n";
import { Box, Divider, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

const AssignmentsDetails = ({ transition, classes }) => {
  const i18n = useI18n();
  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <Box className={classes.spaceGrid}>
          <div className={classes.transtionLabel}>
            {i18n.t("transition.recipient")}
          </div>
          <div className={classes.transtionValue}>
            {transition.transitioned_to}
          </div>
        </Box>
      </Grid>
      <Grid item md={6} xs={12}>
        <Box>
          <div className={classes.transtionLabel}>
            {i18n.t("transition.assigned_by")}
          </div>
          <div className={classes.transtionValue}>
            {transition.transitioned_by}
          </div>
        </Box>
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
