import React from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

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

  const renderLogos = () => {
    if (isEmpty(agencyLogos)) {
      return (
        <div
          id="unicef-logo"
          className={css.agencyLogo}
          style={{ backgroundImage: `url(${unicefLogo})` }}
        />
      );
    }

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
