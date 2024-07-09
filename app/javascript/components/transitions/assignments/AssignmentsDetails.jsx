// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Divider, Grid } from "@mui/material";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";
import DisplayData from "../../display-data";

import { ASSIGNMENTS_DETAILS_NAME as NAME } from "./constants";

function AssignmentsDetails({ transition, classes }) {
  const i18n = useI18n();

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.recipient" value={transition.transitioned_to} />
      </Grid>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.assigned_by" value={transition.transitioned_by} />
      </Grid>
      <Grid item md={12} xs={12}>
        <div>
          <Divider />
          <div className={classes.transtionLabel}>{i18n.t("transition.notes")}</div>
          <div className={classes.transtionValue}>{transition.notes}</div>
        </div>
      </Grid>
    </Grid>
  );
}

AssignmentsDetails.displayName = NAME;

AssignmentsDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  transition: PropTypes.object.isRequired
};

export default AssignmentsDetails;
