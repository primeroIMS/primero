import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MUIDataTable from "mui-datatables";
import { Grid } from "@material-ui/core";
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

const PotentialMatches = ({ fetchPotentialMatches, potentialMatches }) => {
  useEffect(() => {
    fetchPotentialMatches();
  }, []);

  const css = makeStyles(styles)();
  const theme = useTheme();
  const i18n = useI18n();

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
    i18n.t("potential_match.inquirer_id"),
    i18n.t("potential_match.name"),
    i18n.t("potential_match.inquiry_date"),
    i18n.t("potential_match.inquirer_tr_name")
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
    pagination: false,
    selectableRows: "none"
  };

  const tracingRequestTableOptions = {
    columns,
    options,
    data: [
      [
        potentialMatches.get("tracingRequestId"),
        potentialMatches.get("relationName"),
        potentialMatches.get("inquiryDate"),
        ""
      ]
    ]
  };

  const matchesTableOptions = {
    columns: [
      { label: i18n.t("potential_match.child_id"), name: "caseId", id: true },
      { label: i18n.t("potential_match.child_age"), name: "age" },
      { label: i18n.t("potential_match.child_gender"), name: "sex" },
      { label: i18n.t("potential_match.social_worker"), name: "user" },
      { label: i18n.t("potential_match.social_worker_agency"), name: "agency" },
      { label: i18n.t("potential_match.score"), name: "score" },
      ""
    ],
    options,
    data: potentialMatches.get("matches")
      ? potentialMatches.get("matches").toJS()
      : []
  };
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <h1 className={css.Title}>
            {i18n.t("potential_matches.display", {
              type: i18n.t("forms.record_types.tracing_request"),
              id: potentialMatches.get("tracingRequestId")
            })}
          </h1>
          <MuiThemeProvider theme={{ ...theme, ...getMuiTheme() }}>
            <MUIDataTable {...tracingRequestTableOptions} />
            <MUIDataTable {...matchesTableOptions} />
          </MuiThemeProvider>
        </Grid>
        <Grid item xs={4}>
          Filters
        </Grid>
      </Grid>
    </div>
  );
};

PotentialMatches.propTypes = {
  potentialMatches: PropTypes.object.isRequired,
  fetchPotentialMatches: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    potentialMatches: selectors.selectPotentialMatches(state)
  };
};

const mapDispatchToProps = {
  fetchPotentialMatches: actions.fetchPotentialMatches
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PotentialMatches);
