import { createMuiTheme } from "@material-ui/core";

import theme from "../../../config/theme";

export default selector =>
  createMuiTheme(
    {
      overrides: {
        MuiTableRow: {
          root: {
            "& td:first-child": {
              borderRight: "1px solid #e0e0e0"
            },
            [selector]: {
              borderRight: "1px solid #e0e0e0"
            }
          }
        }
      }
    },
    theme
  );
