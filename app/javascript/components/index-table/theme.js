import { createMuiTheme } from "@material-ui/core";

import theme from "../../config/theme";

export default createMuiTheme(
  {
    overrides: {
      MuiTableCell: {
        body: {
          padding: ".5em",
          [theme.breakpoints.down("sm")]: {
            border: "none",
            "& div": {
              fontSize: "0.85rem"
            },
            "& > div:first-of-type": {
              display: "none"
            }
          }
        }
      },
      MUIDataTableBodyRow: {
        root: {
          [theme.breakpoints.down("sm")]: {
            "& td:nth-of-type(2)": {
              paddingBottom: 0,
              fontWeight: "bold"
            },
            "& td:nth-of-type(n+3):not(:last-of-type)": {
              width: "auto",
              marginRight: "5%",
              "& div": {
                width: "auto"
              }
            },
            "& td:nth-of-type(n+6):not(:last-of-type):not(.datatables-noprint)": {
              display: "none"
            },
            "& td:last-of-type:not(.datatables-noprint)": {
              position: "absolute",
              right: "2%",
              width: "48px",
              top: 0
            },
            "& .datatables-noprint": {
              width: "100%"
            }
          }
        }
      }
    }
  },
  theme
);
