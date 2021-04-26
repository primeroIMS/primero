import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";

import { useApp } from "../application";
import { useI18n } from "../i18n";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ mobile }) => {
  const css = useStyles();
  const { online } = useApp();
  const i18n = useI18n();
  const classes = clsx({
    [css.networkIndicator]: true,
    [css.offline]: !online,
    [css.online]: online,
    [css.mobile]: mobile
  });

  return (
    <div className={classes}>
      {online ? <CheckIcon /> : <SignalWifiOffIcon />}
      <span className={css.status}>{online ? i18n.t("online") : i18n.t("offline")}</span>
    </div>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  mobile: false
};

Component.propTypes = {
  mobile: PropTypes.bool
};

export default Component;
