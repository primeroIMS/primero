// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_TYPES } from "../../../config";
import { useI18n } from "../../i18n";
import { useMemoizedSelector } from "../../../libs";
import { getMiniFormFields } from "../../record-form";
import { getCommonMiniFormFields } from "../../record-form/selectors";

import viewModalForm from "./form";
import { COMMON_FIELD_NAMES, OWNABLE_FIELD_NAMES } from "./constants";

function useViewModalForms({ record, recordType, useRows = true }) {
  const moduleID = record?.get("module_id");
  const i18n = useI18n();
  const commonFieldNames = Object.values(COMMON_FIELD_NAMES);
  const miniFormFields = useMemoizedSelector(state =>
    getMiniFormFields(state, RECORD_TYPES[recordType], moduleID, commonFieldNames)
  );
  const commonFields = useMemoizedSelector(state =>
    getCommonMiniFormFields(state, RECORD_TYPES[recordType], moduleID, commonFieldNames)
  );
  const ownershipDisplayNames = {
    [OWNABLE_FIELD_NAMES.OWNED_BY]: i18n.t("cases.case_worker_code"),
    [OWNABLE_FIELD_NAMES.OWNED_BY_AGENCY]: i18n.t("cases.agency")
  };

  const forms = viewModalForm({ ownershipDisplayNames, commonFields, miniFormFields, useRows });

  return {
    miniFormFields,
    forms
  };
}

export default useViewModalForms;
