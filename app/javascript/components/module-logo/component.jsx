// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";

import useMemoizedSelector from "../../libs/use-memoized-selector";

import css from "./styles.css";
import { getLogo } from "./utils";
import { getModuleLogoID } from "./selectors";

const ModuleLogo = ({ moduleLogo, white }) => {
  const tabletDisplay = useMediaQuery(theme => theme.breakpoints.only("md"));

  const moduleLogoID = useMemoizedSelector(state => getModuleLogoID(state));

  const [fullLogo, smallLogo] = getLogo(moduleLogo || moduleLogoID, white);

  return (
    <div className={css.logoContainer}>
      <img src={tabletDisplay ? smallLogo : fullLogo} alt="Primero" className={css.logo} />
    </div>
  );
};

ModuleLogo.displayName = "ModuleLogo";

ModuleLogo.propTypes = {
  moduleLogo: PropTypes.string,
  white: PropTypes.bool
};

export default ModuleLogo;
