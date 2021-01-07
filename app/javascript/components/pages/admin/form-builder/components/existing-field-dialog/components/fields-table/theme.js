/* eslint-disable import/prefer-default-export */
import { createMuiTheme } from "@material-ui/core/styles";

import theme from "../../../../../../../../config/theme";

export const fieldsTableTheme = createMuiTheme({
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
  },
  theme
});
