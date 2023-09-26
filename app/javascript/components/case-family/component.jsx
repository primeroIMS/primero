import PropTypes from "prop-types";

import { FAMILY_FROM_CASE, RECORD_TYPES } from "../../config";
import { LINK_FAMILY_RECORD_FROM_CASE, RESOURCES, usePermissions } from "../permissions";
import CaseLinkedRecord from "../case-linked-record";

import { FAMILY_ID, FAMILY_ID_DISPLAY, FAMILY_NAME, FAMILY_NUMBER, FAMILY_OVERVIEW } from "./constants";

function Component({ handleToggleNav, mobileDisplay, mode, primeroModule, record, recordType, setFieldValue, values }) {
  const { linkFamilyRecord } = usePermissions(RESOURCES.cases, { linkFamilyRecord: LINK_FAMILY_RECORD_FROM_CASE });

  return (
    <CaseLinkedRecord
      values={values}
      record={record}
      mode={mode}
      mobileDisplay={mobileDisplay}
      handleToggleNav={handleToggleNav}
      primeroModule={primeroModule}
      recordType={recordType}
      linkedRecordType={RECORD_TYPES.families}
      setFieldValue={setFieldValue}
      linkField={FAMILY_ID}
      caseFormUniqueId={FAMILY_FROM_CASE}
      linkedRecordFormUniqueId={FAMILY_OVERVIEW}
      headerFieldNames={[FAMILY_ID_DISPLAY, FAMILY_NUMBER, FAMILY_NAME]}
      searchFieldNames={[FAMILY_NUMBER, FAMILY_NAME]}
      validatedFieldNames={[FAMILY_NUMBER, FAMILY_NAME]}
      showHeader={linkFamilyRecord}
      showAddNew={linkFamilyRecord}
      showSelectButton={linkFamilyRecord && !mode.isShow}
      permissions={{ linkFamilyRecord }}
      isPermitted={linkFamilyRecord}
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
