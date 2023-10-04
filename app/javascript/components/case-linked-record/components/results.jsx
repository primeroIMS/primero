import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { useMemoizedSelector } from "../../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import IndexTable, { getRecords, getLoading } from "../../index-table";
import LoadingIndicator from "../../loading-indicator";
import { RECORD_TYPES_PLURAL } from "../../../config";
import { applyFilters } from "../../index-filters";
import { getMetadata } from "../../record-list";
import css from "../../record-form/form/subforms/styles.css";

import ResultDetails from "./result-details";

function Component({
  fields,
  formName,
  handleCancel,
  linkedRecordFormUniqueId,
  linkedRecordType,
  linkField,
  linkFieldDisplay,
  locale,
  mode,
  online,
  permissions,
  primeroModule,
  recordType,
  redirectIfNotAllowed,
  searchParams = {},
  setComponent,
  setDrawerTitle,
  setFieldValue,
  showSelectButton = false
}) {
  setDrawerTitle("results");
  redirectIfNotAllowed(permissions.writeRegistryRecord);

  const dispatch = useDispatch();

  const [detailsID, setDetailsID] = useState(null);

  const metadata = useMemoizedSelector(state => getMetadata(state, RECORD_TYPES_PLURAL[linkedRecordType]));
  const isLoading = useMemoizedSelector(state => getLoading(state));
  const results = useMemoizedSelector(state => getRecords(state, RECORD_TYPES_PLURAL[linkedRecordType], true));

  const params = metadata?.merge({ ...searchParams, fields: "short" });

  const handleRowClick = record => {
    setDetailsID(record.get("id"));
  };

  const handleReturn = useCallback(() => {
    setDetailsID(null);
  }, [setDetailsID]);

  useEffect(() => {
    dispatch(applyFilters({ recordType: RECORD_TYPES_PLURAL[linkedRecordType], data: params }));
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
    recordType: RECORD_TYPES_PLURAL[linkedRecordType],
    bypassInitialFetch: true,
    onRowClick: handleRowClick,
    options: { selectableRows: "none", rowsPerPageOptions: [], elevation: 0 },
    checkComplete: true
  };

  const handleBack = () => {
    setComponent(0);
  };

  const backButtonText = online ? "case.back_to_search" : "case.back_to_case";
  const backButtonFunc = online ? handleBack : handleCancel;

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
        linkedRecordType={linkedRecordType}
        linkedRecordFormUniqueId={linkedRecordFormUniqueId}
        showSelectButton={showSelectButton}
        linkField={linkField}
        linkFieldDisplay={linkFieldDisplay}
      />
    );
  }

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text={backButtonText}
          rest={{ onClick: backButtonFunc }}
          icon={<ArrowBackIosIcon />}
        />
      </div>
      <LoadingIndicator hasData={results.size > 0} loading={isLoading} type="registry">
        <IndexTable {...tableOptions} />
      </LoadingIndicator>
    </>
  );
}

Component.displayName = "Results";

Component.propTypes = {
  fields: PropTypes.object.isRequired,
  formName: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  linkedRecordFormUniqueId: PropTypes.string,
  linkedRecordType: PropTypes.string.isRequired,
  linkField: PropTypes.string.isRequired,
  linkFieldDisplay: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired,
  online: PropTypes.bool.isRequired,
  permissions: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  searchParams: PropTypes.object,
  setComponent: PropTypes.func.isRequired,
  setDrawerTitle: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  showSelectButton: PropTypes.func.isRequired
};

export default Component;
