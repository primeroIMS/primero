import PropTypes from "prop-types";
import { fromJS } from "immutable";

import { useI18n } from "../i18n";
import { useMemoizedSelector } from "../../libs";
import { getRecordFormsByUniqueId } from "../record-form/selectors";
import { getRegistryOptionsByType } from "../application/selectors";
import { getRelatedRecord } from "../records";
import { RECORD_TYPES } from "../../config";
import RecordHeader from "../case-linked-record/components/record-header";

function Component({ value, recordType, disabled, noStyling = false }) {
  const i18n = useI18n();

  const caseLinkedForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      recordType,
      getFirst: true
    })
  );
  const title = caseLinkedForm?.getIn(["name", i18n.locale], null);
  const formName = caseLinkedForm?.i18nName ? i18n.t(title) : title;
  const emptyPlaceholderText = i18n.t(`${recordType}.registry_empty_placeholder`);
  const relatedRecord = useMemoizedSelector(state =>
    getRelatedRecord(state, { recordType, fromRelationship: false, id: value })
  );
  const registryOptions = useMemoizedSelector(state =>
    getRegistryOptionsByType(state, relatedRecord?.get("registry_type"))
  );
  const linkedRecords = relatedRecord.isEmpty() ? fromJS([]) : fromJS([relatedRecord]);

  return (
    <RecordHeader
      recordType={recordType}
      fieldNames={registryOptions.collapsed_field_names}
      linkedRecordType={RECORD_TYPES.registry_records}
      linkedRecords={linkedRecords}
      idField="id"
      formName={formName}
      emptyPlaceholderText={emptyPlaceholderText}
      disabled={disabled}
      noStyling={noStyling}
    />
  );
}

Component.displayName = "RegistrySummary";

Component.propTypes = {
  disabled: PropTypes.bool,
  noStyling: PropTypes.bool,
  recordType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default Component;
