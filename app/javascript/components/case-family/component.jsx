// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import { useApp } from "../application";
import { useMemoizedSelector } from "../../libs";
import { FAMILY_FROM_CASE, RECORD_PATH, RECORD_TYPES } from "../../config";
import { LINK_FAMILY_RECORD_FROM_CASE, VIEW_FAMILY_RECORD_FROM_CASE, RESOURCES, usePermissions } from "../permissions";
import CaseLinkedRecord from "../case-linked-record";
import { fetchRecord, getLoadingRecordState, selectRecord } from "../records";

import { FAMILY_ID, FAMILY_ID_DISPLAY, FAMILY_NAME, FAMILY_NUMBER, FAMILY_OVERVIEW } from "./constants";

function Component({ handleToggleNav, mobileDisplay, mode, primeroModule, recordType, setFieldValue, values }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();
  const familyId = values[FAMILY_ID];
  const { linkFamilyRecord, viewFamilyRecord } = usePermissions(RESOURCES.cases, {
    linkFamilyRecord: LINK_FAMILY_RECORD_FROM_CASE,
    viewFamilyRecord: VIEW_FAMILY_RECORD_FROM_CASE
  });
  const familyRecord = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow: true, recordType: RECORD_PATH.families, id: familyId })
  );
  const isRecordLoading = useMemoizedSelector(state => getLoadingRecordState(state, RECORD_TYPES.families));

  const searchTitle = i18n.t(`${recordType}.search_for`, { record_type: i18n.t("families.label") });

  useEffect(() => {
    if (familyRecord.isEmpty() && familyId && online) {
      dispatch(fetchRecord(RECORD_PATH.families, familyId));
    }
  }, [familyId, online, familyRecord.isEmpty()]);

  const linkedRecords = familyRecord.isEmpty() ? fromJS([]) : fromJS([familyRecord]);

  return (
    <CaseLinkedRecord
      mode={mode}
      mobileDisplay={mobileDisplay}
      handleToggleNav={handleToggleNav}
      primeroModule={primeroModule}
      recordType={recordType}
      linkedRecordType={RECORD_TYPES.families}
      setFieldValue={setFieldValue}
      linkedRecords={linkedRecords}
      linkField={FAMILY_ID}
      headerLoading={isRecordLoading}
      drawerTitles={{ search: searchTitle }}
      linkFieldDisplay={FAMILY_ID_DISPLAY}
      caseFormUniqueId={FAMILY_FROM_CASE}
      linkedRecordFormUniqueId={FAMILY_OVERVIEW}
      headerFieldNames={[FAMILY_ID_DISPLAY, FAMILY_NUMBER, FAMILY_NAME]}
      searchFieldNames={[FAMILY_NUMBER, FAMILY_NAME]}
      validatedFieldNames={[FAMILY_NUMBER, FAMILY_NAME]}
      showHeader={viewFamilyRecord || linkFamilyRecord}
      addNewProps={{ show: linkFamilyRecord && !familyId && !mode.isShow }}
      showSelectButton={linkFamilyRecord && !mode.isShow}
      permissions={{ linkFamilyRecord, viewFamilyRecord }}
      isPermitted={linkFamilyRecord || viewFamilyRecord}
      phoneticFieldNames={[FAMILY_NAME]}
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
