// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack";
import { Brightness1 as Circle } from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import { makeStyles } from "@mui/styles";

import useThemeHelpers from "../../libs/use-theme-helpers";

import { NAME } from "./constants";
import { snackVariantClasses } from "./theme";

const Component = ({ children }) => {
  const { theme } = useThemeHelpers();
  const classes = makeStyles(snackVariantClasses(theme))();

  return (
    <SnackbarProvider
      maxSnack={3}
      dense
      iconVariant={{
        success: <CheckIcon />,
        error: <ErrorIcon />,
        warning: <SignalWifiOffIcon />,
        info: <Circle />
      }}
      classes={{
        lessPadding: classes.lessPadding,
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info
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
