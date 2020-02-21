import React, { useState } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useSelector } from "react-redux";

import UnicefLogo from "../../images/unicef.png";
import UnicefPictorial from "../../images/unicef-pictorial.png";
import { getAgencyLogos } from "../application/selectors";

import styles from "./styles.css";

const AgencyLogo = () => {
  const css = makeStyles(styles)();
  const theme = useTheme();
  const agencyLogos = useSelector(state => getAgencyLogos(state));
  const tabletDisplay = useMediaQuery(theme.breakpoints.down("md"));
  const unicefLogo = tabletDisplay ? UnicefPictorial : UnicefLogo;
  const [showImage, setShowImage] = useState(true);

  const renderLogos = () => {
    if (agencyLogos) {
      return agencyLogos.map(agency => {
        const {
          unique_id: uniqueId,
          logo_icon: logoIcon,
          logo_full: logoFull
        } = agency;
        const logo = tabletDisplay ? logoIcon : logoFull;

        return (
          <div
            key={uniqueId}
            className={css.agencyLogo}
            style={{ backgroundImage: `url(${logo})` }}
          />
        );
      });
    }

    return (
      <div
        className={css.agencyLogo}
        style={{ backgroundImage: `url(${unicefLogo})` }}
      />
    );
  };

  return (
    <Box className={css.agencyLogoContainer}>
      {showImage ? <>{renderLogos()}</> : null}
    </Box>
  );
};

AgencyLogo.displayName = "AgencyLogo";

export default AgencyLogo;
