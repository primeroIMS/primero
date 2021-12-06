import { createTheme } from "@material-ui/core";

export default clickableCell =>
  createTheme({
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
  });
