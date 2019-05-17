import React from "react";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import UnicefLogo from "images/unicef.png";
import styles from "./styles.module.scss";

const AgencyLogo = ({ logo, agency }) => (
  <Box className={styles.agencyLogoContainer}>
    <div className={styles.line} />
    <img
      className={styles.agencyLogo}
      src={logo || UnicefLogo}
      alt={agency || "unicef"}
    />
    <div className={styles.line} />
  </Box>
);

AgencyLogo.propTypes = {
  logo: PropTypes.string,
  agency: PropTypes.string
};

export default AgencyLogo;
