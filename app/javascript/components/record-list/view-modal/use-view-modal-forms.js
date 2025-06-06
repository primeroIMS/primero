// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_TYPES } from "../../../config";
import { useI18n } from "../../i18n";
import { useMemoizedSelector } from "../../../libs";
import { getMiniFormFields } from "../../record-form";
import { getCommonMiniFormFields } from "../../record-form/selectors";

import viewModalForm from "./form";
import { COMMON_FIELD_NAMES } from "./constants";

function useViewModalForms({ record, recordType }) {
  const moduleID = record?.get("module_id");
  const i18n = useI18n();
  const commonFieldNames = Object.values(COMMON_FIELD_NAMES);
  const miniFormFields = useMemoizedSelector(state =>
    getMiniFormFields(state, RECORD_TYPES[recordType], moduleID, commonFieldNames)
  );
  const commonMiniFormFields = useMemoizedSelector(state =>
    getCommonMiniFormFields(state, RECORD_TYPES[recordType], moduleID, commonFieldNames)
  );
  const forms = viewModalForm(i18n, commonMiniFormFields, miniFormFields);

  return {
    miniFormFields,
    forms
  };
}

export default useViewModalForms;
