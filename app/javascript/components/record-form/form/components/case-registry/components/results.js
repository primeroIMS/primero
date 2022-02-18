import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useMemoizedSelector } from "../../../../../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";
import css from "../../../subforms/styles.css";
import IndexTable, { getRecords, getLoading } from "../../../../../index-table";
import LoadingIndicator from "../../../../../loading-indicator";
import { REGISTRY_RECORDS } from "../../../../../../config";
import { applyFilters } from "../../../../../index-filters";
import { getMetadata } from "../../../../../record-list";

import ResultDetails from "./result-details";

const Results = ({
  redirectIfNotAllowed,
  setComponent,
  fields,
  searchParams = {},
  recordType,
  handleCancel,
  setDrawerTitle,
  mode,
  primeroModule,
  permissions,
  locale,
  setFieldValue,
  formName
}) => {
  setDrawerTitle("results");
  redirectIfNotAllowed(permissions.writeRegistryRecord);

  const dispatch = useDispatch();

  const [detailsID, setDetailsID] = useState(null);

  const metadata = useMemoizedSelector(state => getMetadata(state, REGISTRY_RECORDS));
  const isLoading = useMemoizedSelector(state => getLoading(state));
  const results = useMemoizedSelector(state => getRecords(state, REGISTRY_RECORDS));

  const params = metadata.merge({ ...searchParams, fields: "short" });

  const handleRowClick = record => {
    setDetailsID(record.get("id"));
  };

  const handleReturn = useCallback(() => {
    setDetailsID(null);
  }, [setDetailsID]);

  useEffect(() => {
    dispatch(applyFilters({ recordType: REGISTRY_RECORDS, data: params }));
  }, []);

  const tableOptions = {
    columns: [
      { name: "short_id", label: "id", id: true },
      ...fields.valueSeq().map(field => ({
        name: field.name,
        label: field.display_name[locale]
      }))
    ],
    title: "",
    defaultFilters: params,
    onTableChange: applyFilters,
    recordType: REGISTRY_RECORDS,
    bypassInitialFetch: true,
    onRowClick: handleRowClick,
    options: { selectableRows: "none", rowsPerPageOptions: [], elevation: 0 }
  };

  const handleBack = () => {
    setComponent(0);
  };

  if (detailsID) {
    return (
      <ResultDetails
        shouldSelect
        id={detailsID}
        handleCancel={handleCancel}
        handleReturn={handleReturn}
        setDrawerTitle={setDrawerTitle}
        mode={mode}
        primeroModule={primeroModule}
        recordType={recordType}
        permissions={permissions}
        redirectIfNotAllowed={redirectIfNotAllowed}
        setFieldValue={setFieldValue}
        formName={formName}
      />
    );
  }

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton type={ACTION_BUTTON_TYPES.default} text="case.back_to_search" rest={{ onClick: handleBack }} />
      </div>
      <LoadingIndicator hasData={results.size > 0} loading={isLoading} type="registry">
        <IndexTable {...tableOptions} />
      </LoadingIndicator>
    </>
  );
};

Results.displayName = "Results";

Results.propTypes = {
  fields: PropTypes.object.isRequired,
  formName: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  searchParams: PropTypes.object,
  setComponent: PropTypes.func.isRequired,
  setDrawerTitle: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

export default Results;
