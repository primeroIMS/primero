// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useMemoizedSelector } from "../../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import IndexTable, { getRecords, getLoading } from "../../index-table";
import LoadingIndicator from "../../loading-indicator";
import { RECORD_TYPES_PLURAL } from "../../../config";
import { getMetadata } from "../../record-list";
import css from "../../record-form/form/subforms/styles.css";
import { fetchRelatedRecords } from "../../records";

function Component({
  columns,
  fields,
  handleCancel,
  isRecordSelectable,
  linkedRecordType,
  locale,
  online,
  onResultClick,
  permissions,
  recordType,
  redirectIfNotAllowed,
  searchParams = {},
  setComponent,
  setDetailsID,
  setShouldSelect
}) {
  const dispatch = useDispatch();
  const metadata = useMemoizedSelector(state => getMetadata(state, RECORD_TYPES_PLURAL[linkedRecordType]));
  const isLoading = useMemoizedSelector(state => getLoading(state));
  const results = useMemoizedSelector(state => getRecords(state, RECORD_TYPES_PLURAL[linkedRecordType], true));

  const params = metadata?.merge({ ...searchParams, fields: "short" });

  const handleResultClick = record => {
    if (onResultClick) {
      onResultClick(record);
    }
  };

  const handleRowClick = record => {
    if (isRecordSelectable) {
      if (isRecordSelectable(record)) {
        setDetailsID(record.get("id"));
        handleResultClick(record);
      }
    } else {
      setDetailsID(record.get("id"));
      handleResultClick(record);
    }
  };

  useEffect(() => {
    redirectIfNotAllowed(permissions.writeRegistryRecord);
    setShouldSelect(true);
    dispatch(
      fetchRelatedRecords({
        recordType: RECORD_TYPES_PLURAL[recordType],
        relatedRecordType: RECORD_TYPES_PLURAL[linkedRecordType],
        data: params
      })
    );
  }, []);

  const tableOptions = {
    columns: columns || [
      { name: "short_id", label: "id", id: true },
      ...fields.valueSeq().map(field => ({
        name: field.name,
        label: field.display_name[locale]
      }))
    ],
    title: "",
    defaultFilters: params,
    onTableChange: ({ data }) =>
      fetchRelatedRecords({
        recordType: RECORD_TYPES_PLURAL[recordType],
        relatedRecordType: RECORD_TYPES_PLURAL[linkedRecordType],
        data
      }),
    recordType: [RECORD_TYPES_PLURAL[recordType], "related_records"],
    translateAsRecordType: RECORD_TYPES_PLURAL[linkedRecordType],
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
  columns: PropTypes.array,
  fields: PropTypes.object.isRequired,
  formName: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  isRecordSelectable: PropTypes.func,
  linkedRecordFormUniqueId: PropTypes.string,
  linkedRecordNamespace: PropTypes.string,
  linkedRecordType: PropTypes.string.isRequired,
  linkField: PropTypes.string.isRequired,
  linkFieldDisplay: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired,
  online: PropTypes.bool.isRequired,
  onResultClick: PropTypes.func,
  permissions: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  searchParams: PropTypes.object,
  setComponent: PropTypes.func.isRequired,
  setDetailsID: PropTypes.func.isRequired,
  setDrawerTitle: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  setShouldSelect: PropTypes.func.isRequired,
  showSelectButton: PropTypes.func.isRequired
};

export default Component;
