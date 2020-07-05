/* eslint-disable import/prefer-default-export */
export const snackVariantClasses = theme => ({
  lessPadding: {
    padding: "0 10px"
  },
  success: {
    border: `1px solid ${theme.primero.colors.solidGreen}`,
    "& svg": {
      color: theme.primero.colors.green
    }
  },
  error: {
    border: `1px solid ${theme.primero.colors.red}`,
    "& svg": {
      color: theme.primero.colors.red
    }
  },
  warning: {
    border: `1px solid ${theme.primero.colors.solidOrange}`,
    "& svg": {
      color: theme.primero.colors.orange
    }
  },
  info: {
    border: `1px solid ${theme.primero.colors.moonYellow}`,
    "& svg": {
      color: theme.primero.colors.moonYellow
    }
  }
});
