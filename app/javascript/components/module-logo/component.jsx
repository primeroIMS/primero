import React from "react";
import Box from "@material-ui/core/Box";
import PrimeroLogo from "images/primero-logo.png";
import GBVLogo from "images/gbv-logo.png";
import MRMLogo from "images/mrm-logo.png";
import CPIMSLogo from "images/cpims-logo.png";
import PrimeroPictorial from "images/primero-pictorial.png";
import GBVPictorial from "images/gbv-pictorial.png";
import CPIMSPictorial from "images/cpims-pictorial.png";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import useTheme from "@material-ui/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import styles from "./styles.css";

const ModuleLogo = ({ moduleLogo }) => {
  const css = makeStyles(styles)();
  const theme = useTheme();
  const tabletDisplay = useMediaQuery(theme.breakpoints.only("md"));

  const logo = (l => {
    switch (l) {
      case "mrm":
        return [MRMLogo, PrimeroPictorial];
      case "gbv":
        return [GBVLogo, GBVPictorial];
      case "cpims":
        return [CPIMSLogo, CPIMSPictorial];
      default:
        return [PrimeroLogo, PrimeroPictorial];
    }
  })(moduleLogo);

  return (
    <Box className={css.logoContainer}>
      <img
        src={tabletDisplay ? logo[1] : logo[0]}
        alt="Primero"
        className={css.logo}
      />
    </Box>
  );
};

ModuleLogo.propTypes = {
  moduleLogo: PropTypes.string
};

export default ModuleLogo;
