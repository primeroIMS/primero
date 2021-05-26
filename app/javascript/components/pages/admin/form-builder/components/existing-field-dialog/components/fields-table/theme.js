/* eslint-disable import/prefer-default-export */

export default theme => ({
  overrides: {
    MUIDataTableHeadCell: {
      root: {
        padding: "0.2em",
        fontWeight: "bold",
        textTransform: "uppercase"
      }
    },
    MUIDataTableBodyCell: {
      root: {
        padding: "0.2em"
      }
    },
    MuiIconButton: {
      root: {
        color: theme.primero.colors.blue
      }
    },
    MUIDataTableBodyRow: {
      root: {
        "&.mui-row-selected": {
          backgroundColor: theme.primero.colors.chromeWhite,

          "&:hover": {
            backgroundColor: theme.primero.colors.chromeWhite
          }
        }
      }
    },
    MUIDataTableSelectCell: {
      root: {
        display: "none"
      }
    }
  }
});
