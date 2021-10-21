/* eslint-disable import/prefer-default-export */
export const snackVariantClasses = theme => ({
  lessPadding: {
    padding: "0 10px"
  },
  success: {
    border: `1px solid ${theme.primero.colors.green}`,
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
    border: `1px solid ${theme.primero.colors.orange}`,
    "& svg": {
      color: theme.primero.colors.orange
    }
  },
  info: {
    border: `1px solid ${theme.primero.colors.yellow}`,
    "& svg": {
      color: theme.primero.colors.yellow
    }
  }
});
