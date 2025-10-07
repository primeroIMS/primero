// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import { useMemoizedSelector } from "../../libs";
import { RECORD_PATH, RECORD_TYPES, REGISTRY_FROM_CASE } from "../../config";
import { READ_REGISTRY_RECORD, RESOURCES, WRITE_REGISTRY_RECORD, usePermissions } from "../permissions";
import { useI18n } from "../i18n";
import CaseLinkedRecord from "../case-linked-record";
import { useApp } from "../application";
import { getRegistryTypes } from "../application/selectors";
import { fetchRecord, selectRecord } from "../records";

import {
  FORM_ID,
  LINK_FIELD,
  REGISTRY_ID_DISPLAY,
  REGISTRY_NO,
  REGISTRY_NAME,
  REGISTRY_SEARCH_FIELDS,
  REGISTRY_DETAILS
} from "./constants";

function Component({ handleToggleNav, mobileDisplay, mode, primeroModule, recordType, setFieldValue, values }) {
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { online } = useApp();
  const registryType = useMemoizedSelector(state => getRegistryTypes(state, "farmer"));
  const { writeRegistryRecord, writeReadRegistryRecord } = usePermissions(RESOURCES.cases, {
    writeRegistryRecord: WRITE_REGISTRY_RECORD,
    writeReadRegistryRecord: [...WRITE_REGISTRY_RECORD, ...READ_REGISTRY_RECORD]
  });
  const registryId = values[LINK_FIELD];
  const registryRecord = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow: true, recordType: RECORD_PATH.registry_records, id: registryId })
  );
  const searchTitle = i18n.t(`${recordType}.search_for`, { record_type: i18n.t("navigation.registry_records") });
  const searchTitleNoForm = i18n.t(`${recordType}.search_for`, {
    record_type: registryType.getIn(["display_text", i18n.locale], "")
  });

  useEffect(() => {
    if (registryRecord.isEmpty() && registryId && online) {
      dispatch(fetchRecord(RECORD_PATH.families, registryId));
    }
  }, [registryId, online, registryRecord.isEmpty()]);

  const linkedRecords = registryRecord.isEmpty() ? fromJS([]) : fromJS([registryRecord]);

  return (
    <CaseLinkedRecord
      mode={mode}
      mobileDisplay={mobileDisplay}
      handleToggleNav={handleToggleNav}
      primeroModule={primeroModule}
      recordType={recordType}
      drawerTitles={{ search: searchTitle, searchNoForm: searchTitleNoForm }}
      linkedRecordType={RECORD_TYPES.registry_records}
      setFieldValue={setFieldValue}
      linkField={LINK_FIELD}
      linkedRecords={linkedRecords}
      caseFormUniqueId={REGISTRY_FROM_CASE}
      linkedRecordFormUniqueId={REGISTRY_DETAILS}
      headerFieldNames={[REGISTRY_ID_DISPLAY, REGISTRY_NO, REGISTRY_NAME]}
      searchFieldNames={REGISTRY_SEARCH_FIELDS}
      validatedFieldNames={[REGISTRY_NAME, REGISTRY_NO]}
      showHeader={writeReadRegistryRecord}
      addNewProps={{ show: writeRegistryRecord && !registryId && !mode.isShow }}
      showSelectButton={writeRegistryRecord && !mode.isShow}
      permissions={{ writeRegistryRecord, writeReadRegistryRecord }}
      isPermitted={writeRegistryRecord}
      formId={FORM_ID}
    />
  );
}

Component.displayName = "CaseRegistry";

Component.propTypes = {
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
