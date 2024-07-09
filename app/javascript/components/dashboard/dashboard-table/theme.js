// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
