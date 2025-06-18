// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import { useI18n } from "../i18n";
import { CASE_RELATIONSHIPS, RECORD_PATH, RECORD_TYPES, RECORD_TYPES_PLURAL } from "../../config";
import { UPDATE_CASE_RELATIONSHIPS, VIEW_CASE_RELATIONSHIPS, RESOURCES, usePermissions } from "../permissions";
import CaseLinkedRecord from "../case-linked-record";
import {
  addRecordRelationship,
  fetchRecordRelationships,
  getRecordRelationships,
  removeRecordRelationship
} from "../records";
import { useMemoizedSelector } from "../../libs";
import useRecordHeaders from "../record-list/use-record-headers";
import { buildTableColumns } from "../record-list";
import useViewModalForms from "../record-list/view-modal/use-view-modal-forms";
import { getFieldByName } from "../record-form/selectors";
import { FormSectionRecord } from "../form";

import SearchForm from "./components/search-form";

const LINKED_RECORD_FIELD_NAMES = Object.freeze([
  ["data", "case_id_display"],
  ["data", "name"],
  ["data", "module_id"]
]);
const RELATIONSHIP_TYPE_FOR_CASE_TYPE = Object.freeze({ person: "farmer_on", farm: "farm_for" });

function Component({ handleToggleNav, mobileDisplay, mode, primeroModule, record, recordType, setFieldValue }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const linkedRecordType = RECORD_TYPES.cases;
  const { updateCaseRelationships, viewCaseRelationships } = usePermissions(RESOURCES.cases, {
    updateCaseRelationships: UPDATE_CASE_RELATIONSHIPS,
    viewCaseRelationships: VIEW_CASE_RELATIONSHIPS
  });
  const recordRelationships = useMemoizedSelector(state =>
    getRecordRelationships(state, { recordType: RECORD_TYPES_PLURAL[linkedRecordType] })
  );
  const caseIdDisplayField = useMemoizedSelector(state =>
    getFieldByName(state, "case_id_display", primeroModule, linkedRecordType)
  );

  const { headers } = useRecordHeaders({
    recordType: RECORD_TYPES_PLURAL[recordType],
    excludes: ["complete", "alert_count", "flag_count", "photo"]
  });

  const selectableOpts = {
    isRecordSelectable: currentRecord =>
      !recordRelationships.some(relationship => relationship.get("case_id") === currentRecord.get("id")),
    messageKey: "already_linked"
  };

  const tableColumns = buildTableColumns(
    headers,
    i18n,
    RECORD_TYPES_PLURAL[recordType],
    {},
    () => true,
    true,
    false,
    selectableOpts
  );

  const searchTitle = i18n.t(`${recordType}.search_for`, { record_type: i18n.t("case.label") });

  const { forms } = useViewModalForms({ record, recordType: RECORD_PATH.cases });

  const formSections = fromJS([
    FormSectionRecord({ unique_id: "record_identification", fields: [caseIdDisplayField] })
  ]).concat(forms);

  const onRecordSelect = linkedRecord => {
    dispatch(
      addRecordRelationship({
        recordType: RECORD_TYPES_PLURAL[recordType],
        linkedRecordType,
        id: linkedRecord.get("id"),
        linkedRecord,
        relationshipType: RELATIONSHIP_TYPE_FOR_CASE_TYPE[record.get("case_type", "person")]
      })
    );
  };

  const onRecordDeselect = linkedRecord => {
    dispatch(
      removeRecordRelationship({
        recordType: RECORD_TYPES_PLURAL[recordType],
        linkedRecordType,
        id: linkedRecord.get("id")
      })
    );
  };

  useEffect(() => {
    if ((viewCaseRelationships || updateCaseRelationships) && record?.get("id")) {
      dispatch(
        fetchRecordRelationships(record.get("id"), RELATIONSHIP_TYPE_FOR_CASE_TYPE[record.get("case_type", "person")])
      );
    }
  }, [mode.isEdit, updateCaseRelationships, handleToggleNav, record?.get("id")]);

  return (
    <CaseLinkedRecord
      disableOffline={{ addNew: true }}
      linkedRecords={recordRelationships}
      mode={mode}
      idField="case_id"
      columns={tableColumns}
      mobileDisplay={mobileDisplay}
      handleToggleNav={handleToggleNav}
      primeroModule={primeroModule}
      recordType={recordType}
      linkedRecordType={linkedRecordType}
      setFieldValue={setFieldValue}
      linkFieldDisplay="case_id_display"
      caseFormUniqueId={CASE_RELATIONSHIPS}
      linkedRecordFormUniqueId="basic_identity"
      headerFieldNames={LINKED_RECORD_FIELD_NAMES}
      searchFieldNames={LINKED_RECORD_FIELD_NAMES}
      validatedFieldNames={LINKED_RECORD_FIELD_NAMES}
      showHeader={viewCaseRelationships || updateCaseRelationships}
      showAddNew={updateCaseRelationships && !mode.isShow}
      showSelectButton={updateCaseRelationships && !mode.isShow}
      permissions={{ updateCaseRelationships, viewCaseRelationships }}
      isPermitted={updateCaseRelationships || viewCaseRelationships}
      phoneticFieldNames={LINKED_RECORD_FIELD_NAMES}
      shouldFetchRecord={false}
      drawerTitles={{ search: searchTitle }}
      i18nKeys={{ addNew: "case_relationships.add_new" }}
      SearchFormComponent={SearchForm}
      recordViewForms={formSections}
      onRecordSelect={onRecordSelect}
      onRecordDeselect={onRecordDeselect}
      isRecordSelectable={selectableOpts.isRecordSelectable}
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
  setFieldValue: PropTypes.func.isRequired
};

export default Component;
