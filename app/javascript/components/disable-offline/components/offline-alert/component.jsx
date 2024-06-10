// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import Alert from "@mui/lab/Alert";
import SignalWifiOff from "@mui/icons-material/SignalWifiOff";

import { useApp } from "../../../application";

import css from "./styles.css";

const Component = ({ text, noMargin }) => {
  const { online } = useApp();

  if (online) return null;

  return (
    <div className={noMargin || css.alert}>
      <Alert icon={<SignalWifiOff />} severity="warning" variant="outlined">
        {text}
      </Alert>
    </div>
  );
};

Component.displayName = "OfflineAlert";

Component.propTypes = {
  noMargin: PropTypes.bool,
  text: PropTypes.string
};

export default Component;
