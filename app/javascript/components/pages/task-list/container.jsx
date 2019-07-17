import React, { useEffect } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import Schedule from "@material-ui/icons/Schedule";
import PriorityHigh from "@material-ui/icons/PriorityHigh";
import { NavLink } from "react-router-dom";
import { useI18n } from "components/i18n";
import {
  createMuiTheme,
  MuiThemeProvider,
  useTheme
} from "@material-ui/core/styles";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

const TaskList = ({ tasks, fetchTasks }) => {
  useEffect(() => {
    fetchTasks();
  }, []);

  const i18n = useI18n();

  const css = makeStyles(styles)();

  const theme = useTheme();

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
        MUIDataTableBodyRow: {
          root: {
            "&:last-child td": {
              border: "none"
            }
          }
        },
        MuiTableCell: {
          head: {
            fontSize: "11px",
            color: theme.primero.colors.grey,
            fontWeight: "bold",
            lineHeight: "1",
            textTransform: "uppercase"
          },
          body: {
            color: theme.primero.colors.grey,
            fontSize: "14px",
            lineHeight: "1",
            "& .RowId": {
              fontWeight: "bold",
              "& a": {
                color: theme.primero.colors.grey
              }
            },
            "& .Scheduled": {
              color: theme.primero.colors.blue
            },
            "& .Overdue": {
              color: theme.primero.colors.red
            }
          }
        }
      }
    });

  const columns = [
    {
      label: i18n.t("task.id"),
      name: "id",
      id: true,
      options: {
        customBodyRender: (value, tableMeta) => {
          let icon = <Schedule className="Scheduled" fontSize="inherit" />;
          if (tableMeta.rowData[4] === "true") {
            icon = <PriorityHigh className="Overdue" fontSize="inherit" />;
          }
          return (
            <span className="RowId">
              <NavLink to={`cases/${value}`}>{value}</NavLink>
              {icon}
            </span>
          );
        }
      }
    },
    { label: i18n.t("task.priority"), name: "priority" },
    { label: i18n.t("task.type"), name: "type" },
    {
      label: i18n.t("task.due_date"),
      name: "due_date",
      options: {
        customBodyRender: (value, tableMeta) => {
          return (
            <span className={tableMeta.rowData[4] === "true" ? "Overdue" : ""}>
              {value}
            </span>
          );
        }
      }
    },
    { label: "overdue", name: "overdue", options: { display: false } }
  ];

  const options = {
    responsive: "stacked",
    fixedHeader: false,
    elevation: 0,
    filter: false,
    download: false,
    search: false,
    print: false,
    viewColumns: false,
    serverSide: true,
    customToolbar: () => null,
    customToolbarSelect: () => null,
    onTableChange: () => null,
    pagination: true,
    selectableRows: "none"
  };

  const tableOptions = {
    columns,
    options,
    data: tasks.toJS()
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <h1 className={css.Title}>{i18n.t("navigation.tasks")}</h1>
        </Grid>
        <Grid item xs={2} />
        <Grid item md={12}>
          <MuiThemeProvider theme={getMuiTheme}>
            <MUIDataTable {...tableOptions} />
          </MuiThemeProvider>
        </Grid>
      </Grid>
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.object.isRequired,
  fetchTasks: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    tasks: selectors.selectTasks(state)
  };
};

const mapDispatchToProps = {
  fetchTasks: actions.fetchTasks
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);
