import React from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useSelector } from "react-redux";

import { getAgencyLogos } from "../application/selectors";

import styles from "./styles.css";

const AgencyLogo = () => {
  const css = makeStyles(styles)();
  const theme = useTheme();
  const agencyLogos = useSelector(state => getAgencyLogos(state));
  const tabletDisplay = useMediaQuery(theme.breakpoints.down("md"));

  const renderLogos = () => {
    return agencyLogos.map(agency => {
      const {
        unique_id: uniqueId,
        logo_icon: logoIcon,
        logo_full: logoFull
      } = agency;
      const logo = tabletDisplay ? logoIcon : logoFull;

      return (
        <div
          id={`${uniqueId}-logo`}
          key={uniqueId}
          className={css.agencyLogo}
          style={{ backgroundImage: `url(${logo})` }}
        />
      );
    });
  };

  return <Box className={css.agencyLogoContainer}>{renderLogos()}</Box>;
};

AgencyLogo.displayName = "AgencyLogo";

export default AgencyLogo;
