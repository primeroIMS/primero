import MenuIcon from "@material-ui/icons/Menu";
import { AppBar, Toolbar, IconButton, makeStyles, Hidden } from "@material-ui/core";
import PropTypes from "prop-types";

import NetworkIndicator from "../network-indicator";
import ModuleLogo from "../module-logo";
import { useApp } from "../application";
import { useI18n } from "../i18n";
import { DEMO } from "../application/constants";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const MobileToolbar = ({ openDrawer }) => {
  const css = useStyles();
  const { demo } = useApp();
  const i18n = useI18n();

  // eslint-disable-next-line react/no-multi-comp, react/display-name
  const demoText = demo ? <div className={css.demoText}>{i18n.t(DEMO)}</div> : null;

  return (
    <Hidden mdUp implementation="css">
      <AppBar position="fixed">
        <Toolbar className={css[demo ? "toolbar-demo" : "toolbar"]}>
          <IconButton edge="start" color="default" aria-label="Menu" onClick={openDrawer}>
            <MenuIcon />
          </IconButton>
          <ModuleLogo className={css.logo} />
          {demoText}
          <NetworkIndicator mobile />
        </Toolbar>
      </AppBar>
    </Hidden>
  );
};

MobileToolbar.displayName = "MobileToolbar";

MobileToolbar.propTypes = {
  openDrawer: PropTypes.func.isRequired
};

export default MobileToolbar;
