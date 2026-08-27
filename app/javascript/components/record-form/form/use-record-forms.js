import { SUMMARY } from "../../../config";
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

import useRecordFormsQuery from "./use-record-form-query";

function useRecordForms({ primeroModule, isEditOrShow, recordType, record }) {
  const query = useRecordFormsQuery({ primeroModule, isEditOrShow, recordType, record });
  const permittedFormsIds = useMemoizedSelector(state => getPermittedForms(state, query));
  const formNav = useMemoizedSelector(state => getFormNav(state, query));
  const forms = useMemoizedSelector(state => getRecordForms(state, query));
  const attachmentForms = useMemoizedSelector(state => getAttachmentForms(state));
  const firstTab = useMemoizedSelector(state => getFirstTab(state, query));
  const recordAttachments = useMemoizedSelector(state => getRecordAttachments(state, recordType));
  const summaryForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, { ...query, formName: SUMMARY, getFirst: true })
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
