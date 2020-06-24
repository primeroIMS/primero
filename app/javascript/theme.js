const baseStyle = theme => ({
  backgroundColor: theme.primero.colors.white,
  color: theme.primero.colors.grey,
  fontWeight: "bold",
  fontSize: theme.typography.pxToRem(12)
});

export const snackVariantClasses = theme => ({
  lessPadding: {
    padding: "0 10px"
  },
  success: {
    ...baseStyle(theme),
    border: `1px solid ${theme.primero.colors.solidGreen}`,
    "& svg": {
      color: theme.primero.colors.green
    }
  },
  error: {
    ...baseStyle(theme),
    border: `1px solid ${theme.primero.colors.red}`,
    "& svg": {
      color: theme.primero.colors.red
    }
  },
  warning: {
    ...baseStyle(theme),
    border: `1px solid ${theme.primero.colors.solidOrange}`,
    "& svg": {
      color: theme.primero.colors.orange
    }
  },
  info: {
    ...baseStyle(theme),
    border: `1px solid ${theme.primero.colors.moonYellow}`,
    "& svg": {
      color: theme.primero.colors.moonYellow
    }
  }
});

export const snackContentClasses = theme => ({
  message: {
    "& svg": {
      fontSize: theme.typography.pxToRem(16),
      marginRight: "5px"
    }
  },
  action: {
    "& svg": {
      fontSize: theme.typography.pxToRem(16),
      color: theme.primero.colors.darkGrey
    }
  }
});
