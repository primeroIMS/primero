import { createMuiTheme } from "@material-ui/core";

import theme from "../../../config/theme";

export default clickableCell =>
  createMuiTheme(
    {
      overrides: {
        MUIDataTableToolbar: {
          root: {
            display: "none !important"
          }
        },
        MuiTableRow: {
          root: {
            cursor: `${clickableCell ? "pointer" : "auto"} !important`
          }
        }
      }
    },
    theme
  );
