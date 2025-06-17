// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";

import { getRecordFormsByUniqueId } from "../../record-form/selectors";
import DisabledRecordIndicator from "../../record-form/form/components/disabled-record-indicator";
import { useMemoizedSelector } from "../../../libs";
import { RECORD_TYPES_PLURAL } from "../../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import css from "../../record-form/form/subforms/styles.css";
import { fetchRecord, getLoadingRecordState, getRelatedRecord, selectRecord } from "../../records";
import Form, { FORM_MODE_SHOW } from "../../form";
import LoadingIndicator from "../../loading-indicator";
import { setupLinkField } from "../utils";

function Component({
  handleCancel,
  handleReturn,
  handleSelection,
  id,
  linkedRecordFormUniqueId,
  linkedRecordType,
  linkFieldDisplay,
  permissions,
  primeroModule,
  redirectIfNotAllowed,
  shouldSelect = false,
  showSelectButton = false,
  recordViewForms = [],
  shouldFetchRecord = true
}) {
  useEffect(() => {
    redirectIfNotAllowed(permissions.writeReadRegistryRecord);
  }, []);

  const dispatch = useDispatch();
  const pluralRecordType = RECORD_TYPES_PLURAL[linkedRecordType];

  const formSection = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: linkedRecordFormUniqueId,
      primeroModule,
      recordType: linkedRecordType,
      getFirst: true
    })
  );

  const selectedRecord = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow: true, recordType: pluralRecordType, id })
  );

  const relatedRecord = useMemoizedSelector(state =>
    getRelatedRecord(state, { recordType: pluralRecordType, fromRelationship: !shouldSelect, id })
  );

  const record = shouldFetchRecord ? selectedRecord : relatedRecord;

  const recordLoading = useMemoizedSelector(state => getLoadingRecordState(state, pluralRecordType));

  const forms = isEmpty(recordViewForms) ? [formSection] : recordViewForms;

  const formSections = record.get("record_in_scope", false)
    ? setupLinkField({
        formSections: forms,
        recordType: pluralRecordType,
        linkFieldDisplay,
        id
      })
    : forms;

  const handleSelect = () => handleSelection(record);

  useEffect(() => {
    if (linkedRecordType && shouldFetchRecord) {
      dispatch(fetchRecord(pluralRecordType, id));
    }
  }, [linkedRecordType, shouldFetchRecord]);

  const selectButtonText = shouldSelect ? "case.select" : "case.deselect";
  const selectButtonIcon = shouldSelect ? <CheckIcon /> : <BlockIcon />;
  const backButtonText = shouldSelect ? "case.back_to_results" : "case.back_to_case";
  const backButtonFunc = shouldSelect ? handleReturn : handleCancel;

  return (
    <LoadingIndicator hasData={record.size > 0} loading={recordLoading}>
      {!record.get("enabled") && <DisabledRecordIndicator recordType={linkedRecordType} />}
      <div className={css.subformFieldArrayContainer}>
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text={backButtonText}
          rest={{ onClick: backButtonFunc }}
          icon={<ArrowBackIosIcon />}
        />
        {showSelectButton && (
          <ActionButton
            type={ACTION_BUTTON_TYPES.default}
            text={selectButtonText}
            onClick={handleSelect}
            icon={selectButtonIcon}
          />
        )}
      </div>
      <Form
        useCancelPrompt={false}
        mode={FORM_MODE_SHOW}
        formSections={formSections}
        initialValues={record.toJS()}
        showTitle={false}
      />
    </LoadingIndicator>
  );
}

Component.displayName = "ResultDetails";

Component.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleReturn: PropTypes.func,
  handleSelection: PropTypes.func,
  id: PropTypes.string.isRequired,
  linkedRecordFormUniqueId: PropTypes.string.isRequired,
  linkedRecordType: PropTypes.string.isRequired,
  linkFieldDisplay: PropTypes.string.isRequired,
  permissions: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordViewForms: PropTypes.array,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  shouldFetchRecord: PropTypes.bool,
  shouldSelect: PropTypes.bool,
  showSelectButton: PropTypes.bool
};

export default Component;
