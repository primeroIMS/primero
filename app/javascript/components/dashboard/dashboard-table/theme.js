import { createTheme } from "@mui/material";

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
