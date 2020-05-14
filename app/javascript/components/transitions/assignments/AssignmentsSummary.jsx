import React from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import { useI18n } from "../../i18n";

import { ASSIGNMENTS_SUMMARY_NAME as NAME } from "./constants";

const AssignmentsSummary = ({ transition, classes }) => {
  const i18n = useI18n();

  // TODO: It has to be modified, on summary should print username
  // const renderTransitioned = !expanded ? (
  //   <Grid item md={6} xs={12}>
  //     <div>{transition.transitioned_to}</div>
  //   </Grid>
  // ) : null;

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={10}>
        <div className={classes.wrapper}>
          <div className={classes.titleHeader}>
            {i18n.t("transition.type.assign")}
          </div>

          {/* TODO: The date should be localized */}
          <div className={classes.date}>
            {format(new Date(transition.created_at), "MMM dd,yyyy")}
          </div>
        </div>
      </Grid>
      {/*  TODO: It has to be modified, on summary should print username */}
      {/* {renderTransitioned} */}
    </Grid>
  );
};

AssignmentsSummary.displayName = NAME;

AssignmentsSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  transition: PropTypes.object.isRequired
};

export default AssignmentsSummary;
