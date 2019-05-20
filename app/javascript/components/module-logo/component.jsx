import React from "react";
import Box from "@material-ui/core/Box";
import PrimeroLogo from "images/primero-logo.png";
import GBVLogo from "images/gbv-logo.png";
import MRMLogo from "images/mrm-logo.png";
import CPIMSLogo from "images/cpims-logo.png";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const ModuleLogo = ({ moduleLogo }) => {
  const logo = (l => {
    switch (l) {
      case "mrm":
        return MRMLogo;
      case "gbv":
        return GBVLogo;
      case "cpims":
        return CPIMSLogo;
      default:
        return PrimeroLogo;
    }
  })(moduleLogo);

  return (
    <Box className={styles.logoContainer}>
      <img src={logo} alt="Primero" className={styles.logo} />
    </Box>
  );
};

ModuleLogo.propTypes = {
  moduleLogo: PropTypes.string
};

export default ModuleLogo;
