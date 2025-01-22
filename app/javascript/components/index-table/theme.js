// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default theme => ({
  components: {
    MuiTableCell: {
      styleOverrides: {
        body: {
          padding: ".5em",
          backgroundColor: "var(--c-white)",
          [theme.breakpoints.down("sm")]: {
            border: "none",
            "& div": {
              fontSize: "var(--fs-13)"
            },
            "& > div:first-of-type": {
              display: "none"
            }
          }
        }
      }
    },
    MUIDataTableBodyRow: {
      styleOverrides: {
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
              right: "3%",
              paddingTop: 2,
              width: "48px"
            },
            "& .datatables-noprint": {
              width: "100%"
            }
          }
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          [theme.breakpoints.down("sm")]: {
            justifyContent: "center"
          }
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        spacer: {
          [theme.breakpoints.down("sm")]: {
            flex: "0 1 auto"
          }
        }
      }
    },
    MuiTableFooter: {
      styleOverrides: {
        root: {
          "& tr td:last-of-type": {
            padding: "0px 0px 0px 24px"
          }
        }
      }
    }
  }
});
