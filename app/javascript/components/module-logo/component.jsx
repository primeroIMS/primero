import React from "react";
import PrimeroLogo from "images/primero-logo.png";
import PrimeroLogoWhite from "images/primero-logo-white.png";
import GBVLogo from "images/gbv-logo.png";
import GBVLogoWhite from "images/gbv-logo-white.png";
import MRMLogo from "images/mrm-logo.png";
import MRMLogoWhite from "images/mrm-logo-white.png";
import CPIMSLogo from "images/cpims-logo.png";
import CPIMSLogoWhite from "images/cpims-logo-white.png";
import PrimeroPictorial from "images/primero-pictorial.png";
import GBVPictorial from "images/gbv-pictorial.png";
import CPIMSPictorial from "images/cpims-pictorial.png";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, useMediaQuery } from "@material-ui/core";
import styles from "./styles.css";

const ModuleLogo = ({ moduleLogo, white }) => {
  const css = makeStyles(styles)();
  const theme = useTheme();
  const tabletDisplay = useMediaQuery(theme.breakpoints.only("md"));

  const logo = (l => {
    switch (l) {
      case "mrm":
        return [white ? MRMLogoWhite : MRMLogo, PrimeroPictorial];
      case "gbv":
        return [white ? GBVLogoWhite : GBVLogo, GBVPictorial];
      case "cpims":
        return [white ? CPIMSLogoWhite : CPIMSLogo, CPIMSPictorial];
      default:
        return [white ? PrimeroLogoWhite : PrimeroLogo, PrimeroPictorial];
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
  moduleLogo: PropTypes.string,
  white: PropTypes.bool
};

export default ModuleLogo;
