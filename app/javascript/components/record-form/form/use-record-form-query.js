import { READ_REGISTRY_RECORD, RESOURCES, SHOW_FIND_MATCH, usePermissions } from "../../permissions";
import {
  READ_FAMILY_RECORD,
  SHOW_ACCESS_LOG,
  SHOW_CHANGE_LOG,
  VIEW_INCIDENTS_FROM_CASE
} from "../../permissions/constants";
import { RECORD_TYPES } from "../../../config";

function useRecordFormsQuery({ primeroModule, isEditOrShow, recordType, record }) {
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

  return {
    recordType: RECORD_TYPES[recordType],
    primeroModule: record?.get("module_id") || primeroModule,
    checkPermittedForms: true,
    renderCustomForms,
    checkWritable: true,
    recordId: record?.get("id"),
    isEditOrShow
  };
}

export default useRecordFormsQuery;
