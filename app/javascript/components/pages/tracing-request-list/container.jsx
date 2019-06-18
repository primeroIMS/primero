import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withI18n } from "libs";
import {
  RecordList,
  Actions,
  selectRecords,
  selectMeta,
  selectFilters,
  selectLoading,
  buildTableColumns
} from "components/record-list";
import NAMESPACE from "./namespace";

const TracingRequestList = ({
  records,
  meta,
  filters,
  i18n,
  loading,
  fetchRecords
}) => {
  const path = "/tracing_requests?fields=short";

  const defaultFilters = {
    inquiry_status: "open",
    record_state: true
  };

  const data = {
    filters: Object.assign({}, defaultFilters, filters),
    records,
    meta
  };

  const columns = buildTableColumns(records, "tracing_request", i18n);

  const recordListProps = {
    title: i18n.t("tracing_request.label"),
    columns,
    data,
    loading,
    path,
    fetchRecords,
    namespace: NAMESPACE
  };

  return (
    <>
      <RecordList {...recordListProps} />
    </>
  );
};

TracingRequestList.propTypes = {
  records: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  fetchRecords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  records: selectRecords(state, NAMESPACE),
  meta: selectMeta(state, NAMESPACE),
  filters: selectFilters(state, NAMESPACE),
  loading: selectLoading(state, NAMESPACE)
});

const mapDispatchToProps = {
  fetchRecords: Actions.fetchRecords
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TracingRequestList)
);
