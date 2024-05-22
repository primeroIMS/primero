// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Divider, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

import { TRANSFER_REQUEST_DETAILS_NAME } from "../constants";
import DisplayData from "../../display-data";
import css from "../styles.css";

const Details = ({ transition }) => {
  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.recipient" value={transition.transitioned_to} />
      </Grid>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.requested_by" value={transition.transitioned_by} />
      </Grid>
      <Grid item md={12} xs={12}>
        <Divider className={css.divider} />
        <DisplayData label="transition.notes" value={transition.notes} />
      </Grid>
    </Grid>
  );
};

Details.displayName = TRANSFER_REQUEST_DETAILS_NAME;

Details.propTypes = {
  transition: PropTypes.object.isRequired
};

export default Details;
