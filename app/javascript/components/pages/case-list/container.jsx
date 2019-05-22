import { IndexTable, DateCell, ToggleIconCell } from "components/index-table";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import { withI18n } from "libs";
import * as actions from "./action-creators";
import styles from "./styles.module.scss";
import namespace from "./namespace";

const defaultFilters = {
  per: 20,
  page: 1,
  scope: {
    child_status: "list||open",
    record_state: "list||true"
  }
};

const Cases = ({ cases, fetchCases, i18n }) => {
  useEffect(() => {
    fetchCases(defaultFilters);
  }, []);

  const columns = [
    { label: i18n.t("case.id"), name: "short_id", id: true },
    { label: i18n.t("case.age"), name: "age" },
    { label: i18n.t("case.sex"), name: "sex" },
    {
      label: i18n.t("case.registration_date"),
      name: "registration_date",
      options: {
        customBodyRender: value => <DateCell value={value} />
      }
    },
    {
      label: i18n.t("case.case_opening_date"),
      name: "created_at",
      options: {
        customBodyRender: value => <DateCell value={value} />
      }
    },
    { label: i18n.t("case.social_worker"), name: "owned_by" },
    {
      label: i18n.t("case.photo"),
      name: "photo_keys",
      options: {
        customBodyRender: value => <ToggleIconCell value={value} icon="photo" />
      }
    },
    {
      label: " ",
      name: "flags",
      options: {
        empty: true,
        customBodyRender: value => <ToggleIconCell value={value} icon="flag" />
      }
    }
  ];

  return (
    <Box className={styles.root}>
      <Box className={styles.table}>
        {!isEmpty(cases.results) && (
          <IndexTable
            title={i18n.t("cases.label")}
            defaultFilters={defaultFilters}
            columns={columns}
            data={cases}
            onTableChange={fetchCases}
          />
        )}
      </Box>
      <Box className={styles.filters}>Filters</Box>
    </Box>
  );
};

Cases.propTypes = {
  cases: PropTypes.object.isRequired,
  fetchCases: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    cases: state.get(namespace).toJS()
  };
};

const mapDispatchToProps = {
  fetchCases: actions.fetchCases
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cases)
);
