// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { RECORD_TYPES, REGISTRY_FROM_CASE } from "../../config";
import { READ_REGISTRY_RECORD, RESOURCES, WRITE_REGISTRY_RECORD, usePermissions } from "../permissions";
import CaseLinkedRecord from "../case-linked-record";

import {
  FORM_ID,
  LINK_FIELD,
  REGISTRY_ID_DISPLAY,
  REGISTRY_NO,
  REGISTRY_NAME,
  REGISTRY_SEARCH_FIELDS,
  REGISTRY_DETAILS
} from "./constants";

function Component({ handleToggleNav, mobileDisplay, mode, primeroModule, record, recordType, setFieldValue, values }) {
  const { writeRegistryRecord, writeReadRegistryRecord } = usePermissions(RESOURCES.cases, {
    writeRegistryRecord: WRITE_REGISTRY_RECORD,
    writeReadRegistryRecord: [...WRITE_REGISTRY_RECORD, ...READ_REGISTRY_RECORD]
  });

  return (
    <CaseLinkedRecord
      values={values}
      record={record}
      mode={mode}
      mobileDisplay={mobileDisplay}
      handleToggleNav={handleToggleNav}
      primeroModule={primeroModule}
      recordType={recordType}
      linkedRecordType={RECORD_TYPES.registry_records}
      setFieldValue={setFieldValue}
      linkField={LINK_FIELD}
      caseFormUniqueId={REGISTRY_FROM_CASE}
      linkedRecordFormUniqueId={REGISTRY_DETAILS}
      headerFieldNames={[REGISTRY_ID_DISPLAY, REGISTRY_NO, REGISTRY_NAME]}
      searchFieldNames={REGISTRY_SEARCH_FIELDS}
      validatedFieldNames={[REGISTRY_NAME, REGISTRY_NO]}
      showHeader={writeReadRegistryRecord}
      showAddNew={writeRegistryRecord}
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
  record: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
