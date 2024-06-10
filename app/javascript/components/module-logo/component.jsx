// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useMediaQuery } from "@mui/material";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getSiteTitle, getThemeLogos } from "../application/selectors";

import css from "./styles.css";
import { getLogo } from "./utils";
import { getModuleLogoID } from "./selectors";

const ModuleLogo = ({ moduleLogo, white, useModuleLogo }) => {
  const tabletDisplay = useMediaQuery(theme => theme.breakpoints.only("md"));

  const moduleLogoID = useMemoizedSelector(state => getModuleLogoID(state));
  const themeLogos = useMemoizedSelector(state => getThemeLogos(state));
  const siteTitle = useMemoizedSelector(state => getSiteTitle(state));
  const selectedModuleLogo = moduleLogo || moduleLogoID;

  const [fullLogo, smallLogo] = getLogo(selectedModuleLogo, white, themeLogos, useModuleLogo);

  return (
    <div className={css.logoContainer}>
      <img
        src={tabletDisplay ? smallLogo : fullLogo}
        alt={siteTitle}
        className={css.logo}
        data-testid={`logo-${selectedModuleLogo}`}
      />
    </div>
  );
};

ModuleLogo.displayName = "ModuleLogo";

ModuleLogo.propTypes = {
  moduleLogo: PropTypes.string,
  useModuleLogo: PropTypes.bool,
  white: PropTypes.bool
};

export default ModuleLogo;
