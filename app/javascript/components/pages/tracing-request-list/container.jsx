import { DateCell, ToggleIconCell } from "components/index-table";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withI18n } from "libs";
import { RecordList, Actions } from "components/record-list";
import * as Selectors from "./selectors";

const TracingRequestList = ({ cases, meta, filters, i18n, loading, fetchRecords }) => {
  const path = "/cases";

  const defaultFilters = {
    child_status: "open",
    record_state: true
  };

  const data = {
    results: cases,
    filters: Object.assign({}, defaultFilters, filters),
    meta
  };

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

  const recordListProps = {
    title: i18n.t("case.label"),
    columns,
    data,
    loading,
    path,
    fetchRecords
  };

  return (
    <>
      <RecordList {...recordListProps} />
    </>
  );
};

TracingRequestList.propTypes = {
  cases: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  fetchRecords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cases: Selectors.selectCases(state),
  meta: Selectors.selectMeta(state),
  filters: Selectors.selectFilters(state),
  loading: Selectors.selectLoading(state)
});

const mapDispatchToProps = {
  fetchRecords: Actions.fetchRecords
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CaseList)
);
