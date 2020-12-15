import { createMuiTheme } from "@material-ui/core";

import theme from "../../../config/theme";

export default selector =>
  createMuiTheme(
    {
      overrides: {
        MuiTableRow: {
          root: {
            "& td:first-child": {
              borderRight: `1px solid ${theme.primero.colors.lightGrey2}`
            },
            [selector]: {
              borderRight: `1px solid ${theme.primero.colors.lightGrey2}`
            }
          }
        }
      }
    },
    theme
  );
