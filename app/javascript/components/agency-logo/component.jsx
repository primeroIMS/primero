import PropTypes from "prop-types";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { memo } from "react";

import { getAgencyLogos } from "../application/selectors";
import { useMemoizedSelector } from "../../libs";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const AgencyLogo = ({ alwaysFullLogo }) => {
  const css = useStyles();
  const theme = useTheme();
  const agencyLogos = useMemoizedSelector(state => getAgencyLogos(state));
  const tabletDisplay = useMediaQuery(theme.breakpoints.down("md"));

  const renderLogos = () => {
    return agencyLogos.map(agency => {
      const uniqueId = agency.get("unique_id");

      const logo = tabletDisplay && !alwaysFullLogo ? agency.get("logo_icon") : agency.get("logo_full");
      const style = { backgroundImage: `url(${logo})` };

      return <div id={`${uniqueId}-logo`} key={uniqueId} className={css.agencyLogo} style={style} />;
    });
  };

  return <Box className={css.agencyLogoContainer}>{renderLogos()}</Box>;
};

AgencyLogo.displayName = "AgencyLogo";

AgencyLogo.defaultProps = {
  alwaysFullLogo: false
};

AgencyLogo.propTypes = {
  alwaysFullLogo: PropTypes.bool
};

export default memo(AgencyLogo);
