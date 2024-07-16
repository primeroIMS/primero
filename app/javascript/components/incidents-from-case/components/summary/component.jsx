// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Grid } from "@mui/material";

import { NAME_SUMMARY } from "../../constants";

function Component({ css, incidentDate, incidentType }) {
  return (
    <Grid container spacing={2} alignItems="center" data-testid="incidentsummary">
      <Grid item md={10} xs={8}>
        <div className={css.wrapper}>
          <div className={css.titleHeader}>{incidentDate}</div>
          <div className={css.titleSubHeader}>{incidentType}</div>
        </div>
      </Grid>
    </Grid>
  );
}

Component.displayName = NAME_SUMMARY;

Component.propTypes = {
  css: PropTypes.object.isRequired,
  incidentDate: PropTypes.string,
  incidentType: PropTypes.node
};
export default Component;
