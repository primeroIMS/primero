import PropTypes from "prop-types";
import clsx from "clsx";
import CheckIcon from "@material-ui/icons/Check";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";

import { useApp } from "../application";
import { useI18n } from "../i18n";
import { useMemoizedSelector } from "../../libs";
import { getFieldMode } from "../application/selectors";

import NetworkIndicatorMobile from "./components/network-indicator-mobile";
import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ mobile }) => {
  const { online } = useApp();
  const i18n = useI18n();

  const fieldMode = useMemoizedSelector(state => getFieldMode(state));

  const classes = clsx({
    [css.networkIndicator]: true,
    [css.offline]: !online,
    [css.online]: online,
    [css.mobile]: mobile
  });

  if (mobile) {
    return <NetworkIndicatorMobile />;
  }

  if (fieldMode) {
    return false;
  }

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
