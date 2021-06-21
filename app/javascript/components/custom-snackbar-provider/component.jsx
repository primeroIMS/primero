import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack";
import { Brightness1 as Circle } from "@material-ui/icons";
import ErrorIcon from "@material-ui/icons/Error";
import CheckIcon from "@material-ui/icons/Check";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";
import { makeStyles } from "@material-ui/core/styles";

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
