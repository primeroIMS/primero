// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack";
import { Brightness1 as Circle } from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      dense
      preventDuplicate
      iconVariant={{
        success: <CheckIcon />,
        error: <ErrorIcon />,
        warning: <SignalWifiOffIcon />,
        info: <Circle />
      }}
      classes={{
        lessPadding: css.lessPadding,
        variantSuccess: css.success,
        variantError: css.error,
        variantWarning: css.warning,
        variantInfo: css.info,
        message: css.message
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node.isRequired
};

export default Component;
