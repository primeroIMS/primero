// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import clsx from "clsx";
import CheckIcon from "@mui/icons-material/Check";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";

import { useApp } from "../application";
import { useI18n } from "../i18n";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getFieldMode } from "../application/selectors";

import NetworkStatus from "./components/network-status";
import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ mobile }) => {
  const { online, useContainedNavStyle } = useApp();
  const i18n = useI18n();

  const fieldMode = useMemoizedSelector(state => getFieldMode(state));

  const classes = clsx({
    [css.networkIndicator]: true,
    [css.offline]: !online,
    [css.online]: online,
    [css.mobile]: mobile,
    [css.contained]: useContainedNavStyle
  });

  if (fieldMode) {
    return <NetworkStatus mobile={mobile} contained={useContainedNavStyle} />;
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
