import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import { NAME_SUMMARY } from "../../constants";

const Component = ({ css, incidentDate, incidentType }) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item md={10} xs={8}>
        <div className={css.wrapper}>
          <div className={css.titleHeader}>{incidentDate}</div>
          <div className={css.titleSubHeader}>{incidentType}</div>
        </div>
      </Grid>
    </Grid>
  );
};

Component.displayName = NAME_SUMMARY;

Component.propTypes = {
  css: PropTypes.object.isRequired,
  incidentDate: PropTypes.string,
  incidentType: PropTypes.node
};
export default Component;
