// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { CASE_RELATIONSHIPS, RECORD_TYPES } from "../../config";
import { UPDATE_CASE_RELATIONSHIPS, VIEW_CASE_RELATIONSHIPS, RESOURCES, usePermissions } from "../permissions";
import CaseLinkedRecord from "../case-linked-record";
import { fetchRecordRelationships, getRecordRelationships } from "../records";
import { useMemoizedSelector } from "../../libs";

import RecordHeader from "./components/record-header";

function Component({ handleToggleNav, mobileDisplay, mode, primeroModule, record, recordType, setFieldValue }) {
  const dispatch = useDispatch();
  const { updateCaseRelationships, viewCaseRelationships } = usePermissions(RESOURCES.cases, {
    updateCaseRelationships: UPDATE_CASE_RELATIONSHIPS,
    viewCaseRelationships: VIEW_CASE_RELATIONSHIPS
  });
  const recordRelationships = useMemoizedSelector(state => getRecordRelationships(state));

  useEffect(() => {
    if (viewCaseRelationships || updateCaseRelationships) {
      // TODO: Figure what to send as relationship type
      dispatch(fetchRecordRelationships(record.get("id"), "farmer_on"));
    }
  }, [mode.isEdit, updateCaseRelationships, handleToggleNav]);

  return (
    <CaseLinkedRecord
      values={recordRelationships}
      record={record}
      mode={mode}
      mobileDisplay={mobileDisplay}
      handleToggleNav={handleToggleNav}
      primeroModule={primeroModule}
      recordType={recordType}
      linkedRecordType={RECORD_TYPES.cases}
      setFieldValue={setFieldValue}
      linkFieldDisplay="case_id_display"
      caseFormUniqueId={CASE_RELATIONSHIPS}
      linkedRecordFormUniqueId="basic_identity"
      headerFieldNames={["name_first", "name_last"]}
      searchFieldNames={["name_first", "name_last"]}
      validatedFieldNames={["name_first", "name_last"]}
      showHeader={viewCaseRelationships || updateCaseRelationships}
      showAddNew={updateCaseRelationships}
      showSelectButton={updateCaseRelationships && !mode.isShow}
      permissions={{ updateCaseRelationships, viewCaseRelationships }}
      isPermitted={updateCaseRelationships || viewCaseRelationships}
      phoneticFieldNames={["name_first", "name_last"]}
      shouldFetchRecord={false}
      recordHeader={props => <RecordHeader {...props} />}
      i18nKeys={{
        searchTitle: "caseRelationships.searchTitle",
        addNew: "caseRelationships.addNew"
      }}
      useRecordViewForms
      usePhoneticSearch
    />
  );
}

Component.displayName = "CaseRelationships";

Component.propTypes = {
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
