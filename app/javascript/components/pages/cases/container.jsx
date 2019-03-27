import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import FlagIcon from "@material-ui/icons/Flag";
import PhotoIcon from "@material-ui/icons/PhotoCamera";
import { IndexTable } from "components/index-table";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import * as actions from "./action-creators";

class Cases extends React.Component {
  constructor(props) {
    super(props);

    this.defaultFilters = {
      per: 20,
      page: 1,
      scope: {
        child_status: "list||open",
        record_state: "list||true"
      }
    };
  }

  componentDidMount() {
    const { fetchCases } = this.props;
    fetchCases(this.defaultFilters);
  }

  render() {
    // TODO: columns obj - How do we set this up per module? (gbv, cp, future modules)
    const columns = [
      { label: "ID", name: "short_id", id: true },
      { label: "Age", name: "age" },
      { label: "Sex", name: "sex" },
      { label: "Registration Date", name: "registration_date" },
      { label: "Case Open Date", name: "created_at" },
      { label: "Social Worker", name: "owned_by" },
      {
        label: "Photo",
        name: "photo_keys",
        options: {
          customBodyRender: value => (
            <IconButton disabled={isEmpty(value)} color="primary">
              <PhotoIcon />
            </IconButton>
          )
        }
      },
      {
        label: "",
        name: "flags",
        options: {
          customBodyRender: value => (
            <IconButton disabled={isEmpty(value)} color="primary">
              <FlagIcon />
            </IconButton>
          )
        }
      }
    ];

    const { cases, fetchCases } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item lg={10} xs={12} sm={12}>
          {!isEmpty(cases.results) && (
            <IndexTable
              defaultFilters={this.defaultFilters}
              columns={columns}
              data={cases}
              onTableChange={fetchCases}
            />
          )}
        </Grid>
        <Grid item lg={2} xs={12}>
          Filters
        </Grid>
      </Grid>
    );
  }
}

Cases.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  cases: PropTypes.object.isRequired,
  fetchCases: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    cases: state.get("Cases").toJS()
  };
};

const mapDispatchToProps = {
  fetchCases: actions.fetchCases
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cases);
