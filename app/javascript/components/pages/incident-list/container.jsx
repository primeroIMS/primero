import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withI18n } from "libs";
import {
  RecordList,
  fetchRecords,
  selectRecords,
  selectMeta,
  selectFilters,
  selectLoading,
  buildTableColumns
} from "components/record-list";
import NAMESPACE from "./namespace";

const IncidentList = ({
  records,
  meta,
  filters,
  i18n,
  loading,
  getRecords
}) => {
  const path = "/incidents?fields=short";

  const defaultFilters = {
    status: "open",
    record_state: true
  };

  const data = {
    filters: Object.assign({}, defaultFilters, filters),
    records,
    meta
  };

  const columns = buildTableColumns(records, "incident", i18n);

  const recordListProps = {
    title: i18n.t("incidents.label"),
    columns,
    data,
    loading,
    path,
    getRecords,
    namespace: NAMESPACE
  };

  return (
    <>
      <RecordList {...recordListProps} />
    </>
  );
};

IncidentList.propTypes = {
  records: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  getRecords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  records: selectRecords(state, NAMESPACE),
  meta: selectMeta(state, NAMESPACE),
  filters: selectFilters(state, NAMESPACE),
  loading: selectLoading(state, NAMESPACE)
});

const mapDispatchToProps = {
  getRecords: fetchRecords
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IncidentList)
);
