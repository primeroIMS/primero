import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import MUIDataTable from "mui-datatables";
import { NavLink } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles/";
import DownloadIcon from "@material-ui/icons/GetApp";
import { PageContainer } from "components/page-container";
import * as actions from "./action-creators";
import * as selectors from "./selectors";
import styles from "./styles.css";

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTableToolbar: {
        root: {
          display: "none"
        }
      },
      MUIDataTableToolbarSelect: {
        root: {
          display: "none"
        }
      },
      MuiTableCell: {
        head: {
          fontSize: "11px",
          color: "rgba(0, 0, 0, 0.54)",
          fontWeight: "bold",
          lineHeight: "1",
          textTransform: "uppercase"
        },
        body: {
          color: "#4a4a4a",
          fontSize: "14px",
          lineHeight: "1",
          "& .RowId": {
            fontWeight: "bold",
            "& a": {
              color: "#4a4a4a"
            }
          }
        }
      }
    }
  });

const ExportList = ({ exportList, getExports }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  useEffect(() => {
    getExports();
  }, []);

  const columns = [
    {
      name: "id",
      options: {
        display: false
      }
    },
    {
      name: "file",
      id: true,
      label: i18n.t("bulk_export.file_name"),
      options: {
        customBodyRender: (value, tableMeta) => {
          return (
            <div className={css.NavLinkContainer}>
              <DownloadIcon />
              <NavLink to={`exports/${tableMeta.rowData[0]}`}>{value}</NavLink>
            </div>
          );
        }
      }
    },
    {
      name: "type",
      label: i18n.t("bulk_export.record_type")
    },
    {
      name: "started",
      label: i18n.t("bulk_export.started_on")
    }
  ];

  const options = {
    fixedHeader: false,
    elevation: 0,
    serverSide: true,
    onTableChange: () => null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 75, 100],
    selectableRows: "none"
  };

  const tableOptions = {
    columns,
    options,
    data: exportList.toJS()
  };

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1 className={css.Title}>{i18n.t("navigation.bulk_exports")}</h1>
        </Grid>
        <Grid item xs={2} />
        <Grid item md={12}>
          <MuiThemeProvider theme={getMuiTheme}>
            <MUIDataTable {...tableOptions} />
          </MuiThemeProvider>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

ExportList.propTypes = {
  exportList: PropTypes.object,
  getExports: PropTypes.func
};

const mapStateToProps = state => ({
  exportList: selectors.selectExports(state)
});

const mapDispatchToProps = {
  getExports: actions.fetchExports
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportList);
