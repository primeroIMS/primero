import { createMuiTheme } from "@material-ui/core";

import theme from "../../../config/theme";

export default createMuiTheme(
  {
    overrides: {
      MUIDataTableToolbar: {
        root: {
          display: "none !important"
        }
      }
    }
  },
  theme
);
