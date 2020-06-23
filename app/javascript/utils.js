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

export const snackContentClasses = theme => ({
  root: {
    backgroundColor: theme.primero.colors.white,
    color: theme.primero.colors.grey
  },
  message: {
    "& svg": {
      fontSize: theme.typography.pxToRem(20),
      marginRight: "5px"
    }
  },
  action: {
    "& svg": {
      fontSize: theme.typography.pxToRem(20),
      color: theme.primero.colors.darkGrey
    }
  }
});
