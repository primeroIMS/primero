import { useEffect } from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import { useApp } from "../application";
import { useMemoizedSelector } from "../../libs";
import { FAMILY_FROM_CASE, RECORD_TYPES, RECORD_TYPES_PLURAL } from "../../config";
import { LINK_FAMILY_RECORD_FROM_CASE, VIEW_FAMILY_RECORD_FROM_CASE, RESOURCES, usePermissions } from "../permissions";
import CaseLinkedRecord from "../case-linked-record";
import { fetchRelatedRecords, getRelatedRecord, getRelatedRecordIsLoading } from "../records";

import { FAMILY_ID, FAMILY_ID_DISPLAY, FAMILY_NAME, FAMILY_NUMBER, FAMILY_PREVIEW_FIELDS } from "./constants";
import usePreviewForms from "./use-preview-form";

function Component({ handleToggleNav, mobileDisplay, mode, primeroModule, recordType, setFieldValue, values }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();
  const familyId = values[FAMILY_ID];
  const { linkFamilyRecord, viewFamilyRecord } = usePermissions(RESOURCES.cases, {
    linkFamilyRecord: LINK_FAMILY_RECORD_FROM_CASE,
    viewFamilyRecord: VIEW_FAMILY_RECORD_FROM_CASE
  });
  const recordTypePlural = RECORD_TYPES_PLURAL[recordType];
  const familyRecord = useMemoizedSelector(state =>
    getRelatedRecord(state, { recordType: recordTypePlural, fromRelationship: false, id: familyId })
  );
  const isRecordLoading = useMemoizedSelector(state => getRelatedRecordIsLoading(state, recordTypePlural));
  const previewForms = usePreviewForms({
    defaultPreviewFieldNames: FAMILY_PREVIEW_FIELDS,
    primeroModule,
    recordType: RECORD_TYPES.families
  });

  const searchTitle = i18n.t(`${recordType}.search_for`, { record_type: i18n.t("families.label") });

  useEffect(() => {
    if (mode.isShow && familyId && online) {
      dispatch(
        fetchRelatedRecords({
          recordType: recordTypePlural,
          relatedRecordType: RECORD_TYPES_PLURAL.family,
          data: { ids: [familyId] }
        })
      );
    }
  }, [familyId, online, mode.isShow]);

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
      recordViewForms={previewForms}
      headerFieldNames={[FAMILY_ID_DISPLAY, FAMILY_NUMBER, FAMILY_NAME]}
      searchFieldNames={[FAMILY_NUMBER, FAMILY_NAME]}
      validatedFieldNames={[FAMILY_NUMBER, FAMILY_NAME]}
      showHeader={viewFamilyRecord || linkFamilyRecord}
      addNewProps={{ show: linkFamilyRecord && !familyId && !mode.isShow }}
      showSelectButton={linkFamilyRecord && !mode.isShow}
      permissions={{ linkFamilyRecord, viewFamilyRecord }}
      isPermitted={linkFamilyRecord || viewFamilyRecord}
      phoneticFieldNames={[FAMILY_NAME]}
      shouldFetchRecord={false}
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
