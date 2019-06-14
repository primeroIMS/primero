import React from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import PropTypes from "prop-types";
import UnicefLogo from "images/unicef.png";
import UnicefPictorial from "images/unicef-pictorial.png";
import { makeStyles, useTheme } from "@material-ui/styles";
import styles from "./styles.css";

const AgencyLogo = ({ logo, agency }) => {
  const css = makeStyles(styles)();
  const theme = useTheme();
  const tabletDisplay = useMediaQuery(theme.breakpoints.only("md"));
  const unicefLogo = tabletDisplay ? UnicefPictorial : UnicefLogo;

  return (
    <Box className={css.agencyLogoContainer}>
      <div className={css.line} />
      <img
        className={css.agencyLogo}
        src={logo || unicefLogo}
        alt={agency || "unicef"}
      />
      <div className={css.line} />
    </Box>
  );
};

AgencyLogo.propTypes = {
  logo: PropTypes.string,
  agency: PropTypes.string
};

export default AgencyLogo;
