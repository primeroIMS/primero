import { useMemo } from "react";

import { READ_REGISTRY_RECORD, RESOURCES, SHOW_FIND_MATCH, usePermissions } from "../../permissions";
import {
  READ_FAMILY_RECORD,
  SHOW_ACCESS_LOG,
  SHOW_CHANGE_LOG,
  VIEW_INCIDENTS_FROM_CASE
} from "../../permissions/constants";
import { RECORD_TYPES, SUMMARY } from "../../../config";
import { useMemoizedSelector } from "../../../libs";
import {
  getAttachmentForms,
  getFirstTab,
  getFormNav,
  getPermittedForms,
  getRecordForms,
  getRecordFormsByUniqueId
} from "../selectors";
import { getRecordAttachments } from "../../records";

function useRecordForms({ primeroModule, isEditOrShow, recordType, record }) {
  const canViewSummaryForm = usePermissions(RESOURCES.potential_matches, SHOW_FIND_MATCH);
  const canViewRegistryRecord = usePermissions(RESOURCES.cases, READ_REGISTRY_RECORD);
  const canViewFamilyRecord = usePermissions(RESOURCES.cases, READ_FAMILY_RECORD);
  const canViewIncidentRecord = usePermissions(RESOURCES.cases, VIEW_INCIDENTS_FROM_CASE);
  const canSeeChangeLog = usePermissions(recordType, SHOW_CHANGE_LOG);
  const canSeeAccessLog = usePermissions(recordType, SHOW_ACCESS_LOG);
  const renderCustomForms =
    canViewSummaryForm ||
    canViewRegistryRecord ||
    canViewFamilyRecord ||
    canViewIncidentRecord ||
    canSeeChangeLog ||
    canSeeAccessLog;

  const selectedModule = useMemo(
    () => ({
      recordType: RECORD_TYPES[recordType],
      primeroModule: record?.get("module_id") || primeroModule,
      checkPermittedForms: true,
      renderCustomForms,
      checkWritable: true,
      recordId: record?.get("id"),
      isEditOrShow
    }),
    [primeroModule, isEditOrShow, record, recordType, renderCustomForms]
  );

  const permittedFormsIds = useMemoizedSelector(state => getPermittedForms(state, selectedModule));
  const formNav = useMemoizedSelector(state => getFormNav(state, selectedModule));
  const forms = useMemoizedSelector(state => getRecordForms(state, selectedModule));
  const attachmentForms = useMemoizedSelector(state => getAttachmentForms(state));
  const firstTab = useMemoizedSelector(state => getFirstTab(state, selectedModule));
  const recordAttachments = useMemoizedSelector(state => getRecordAttachments(state, recordType));
  const summaryForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, { ...selectedModule, formName: SUMMARY, getFirst: true })
  );

  return {
    permittedFormsIds,
    formNav,
    forms,
    firstTab,
    attachmentForms,
    recordAttachments,
    summaryForm
  };
}

export default useRecordForms;
