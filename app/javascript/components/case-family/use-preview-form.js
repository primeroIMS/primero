import { fromJS } from "immutable";

import { useMemoizedSelector } from "../../libs";
import { getRecordFieldsByName, getMiniFormFields } from "../record-form/selectors";
import { FormSectionRecord } from "../form";

function usePreviewForms({ defaultPreviewFieldNames, primeroModule, recordType }) {
  const defaultPreviewFields = useMemoizedSelector(state =>
    getRecordFieldsByName(state, {
      name: defaultPreviewFieldNames,
      recordType,
      primeroModule,
      omitDuplicates: true,
      checkVisible: false,
      checkPermittedForms: false
    })
  );

  const sortedDefaultPreviewFields = defaultPreviewFields.sort(
    (field1, field2) => defaultPreviewFieldNames.indexOf(field1.name) - defaultPreviewFieldNames.indexOf(field2.name)
  );
  const miniFormFields = useMemoizedSelector(state =>
    getMiniFormFields(state, recordType, primeroModule, defaultPreviewFieldNames)
  );

  return fromJS([
    FormSectionRecord({
      uniqueId: "family_preview",
      fields: sortedDefaultPreviewFields.concat(miniFormFields)
    })
  ]);
}

export default usePreviewForms;
