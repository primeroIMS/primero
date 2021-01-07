import { createMuiTheme } from "@material-ui/core";

import theme from "../../../../../config/theme";

export default () =>
  createMuiTheme(
    {
      overrides: {
        MuiStepConnector: {
          root: {
            flex: "1 1 auto",
            marginBottom: "40px"
          }
        }
      }
    },
    theme
  );
