import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, useMediaQuery } from "@material-ui/core";

import { useMemoizedSelector } from "../../libs";

import styles from "./styles.css";
import { getLogo } from "./utils";
import { getModuleLogoID } from "./selectors";

const useStyles = makeStyles(styles);

const ModuleLogo = ({ moduleLogo, white }) => {
  const css = useStyles();
  const tabletDisplay = useMediaQuery(theme => theme.breakpoints.only("md"));

  const moduleLogoID = useMemoizedSelector(state => getModuleLogoID(state));

  const [fullLogo, smallLogo] = getLogo(moduleLogo || moduleLogoID, white);

  return (
    <Box className={css.logoContainer}>
      <img src={tabletDisplay ? smallLogo : fullLogo} alt="Primero" className={css.logo} />
    </Box>
  );
};

ModuleLogo.displayName = "ModuleLogo";

ModuleLogo.propTypes = {
  moduleLogo: PropTypes.string,
  white: PropTypes.bool
};

export default ModuleLogo;
