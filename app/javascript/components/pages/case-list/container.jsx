import { IndexTable, DateCell, ToggleIconCell } from "components/index-table";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import { withI18n } from "libs";
import { makeStyles } from "@material-ui/styles";
import * as actions from "./action-creators";
import styles from "./styles.css";
import * as Selectors from "./selectors";

const defaultFilters = {
  per: 20,
  page: 1,
  child_status: "open",
  record_state: true
};

const CaseList = ({ cases, meta, filters, fetchCases, i18n, loading }) => {
  const css = makeStyles(styles)();

  const data = {
    results: cases,
    meta,
    filters
  };

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
    <Box className={css.root}>
      <Box className={css.table}>
        {!isEmpty(cases) && (
          <IndexTable
            title={i18n.t("cases.label")}
            defaultFilters={defaultFilters}
            columns={columns}
            data={data}
            onTableChange={fetchCases}
            loading={loading}
          />
        )}
      </Box>
      <Box className={css.filters}>Filters</Box>
    </Box>
  );
};

CaseList.propTypes = {
  cases: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  fetchCases: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  cases: Selectors.selectCases(state),
  meta: Selectors.selectFilters(state),
  filters: Selectors.selectFilters(state),
  loading: Selectors.selectLoading(state)
});

const mapDispatchToProps = {
  fetchCases: actions.fetchCases
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CaseList)
);
