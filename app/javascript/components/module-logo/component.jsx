import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, useMediaQuery } from "@material-ui/core";

import styles from "./styles.css";
import { getLogo } from "./utils";

const useStyles = makeStyles(styles);

const ModuleLogo = ({ moduleLogo, white }) => {
  const css = useStyles();
  const theme = useTheme();
  const tabletDisplay = useMediaQuery(theme.breakpoints.only("md"));
  const [fullLogo, smallLogo] = getLogo(moduleLogo, white);

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
