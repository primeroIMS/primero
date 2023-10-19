// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";

import { getRecordFormsByUniqueId } from "../../record-form/selectors";
import DisabledRecordIndicator from "../../record-form/form/components/disabled-record-indicator";
import { useMemoizedSelector } from "../../../libs";
import { RECORD_TYPES_PLURAL } from "../../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import css from "../../record-form/form/subforms/styles.css";
import { fetchRecord, selectRecord } from "../../records";
import Form, { FORM_MODE_SHOW, LINK_FIELD } from "../../form";

function Component({
  formName,
  handleCancel,
  handleReturn,
  id,
  linkedRecordFormUniqueId,
  linkedRecordType,
  linkField,
  linkFieldDisplay,
  permissions,
  primeroModule,
  redirectIfNotAllowed,
  setDrawerTitle,
  setFieldValue,
  shouldSelect = false,
  showSelectButton = false
}) {
  setDrawerTitle(formName, {}, false);
  redirectIfNotAllowed(permissions.writeReadRegistryRecord);

  const dispatch = useDispatch();

  let formSection = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: linkedRecordFormUniqueId,
      primeroModule,
      recordType: linkedRecordType,
      getFirst: true
    })
  );

  formSection = useMemo(() => {
    if (linkFieldDisplay) {
      formSection = formSection.set(
        "fields",
        formSection.fields.map(field => {
          if (field.name === linkFieldDisplay) {
            return field.set("type", LINK_FIELD).set("href", `/${RECORD_TYPES_PLURAL[linkedRecordType]}/${id}`);
          }

          return field;
        })
      );
    }

    return formSection;
  }, [linkFieldDisplay]);

  const record = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow: true, recordType: RECORD_TYPES_PLURAL[linkedRecordType], id })
  );

  useEffect(() => {
    if (linkedRecordType) {
      dispatch(fetchRecord(RECORD_TYPES_PLURAL[linkedRecordType], id));
    }
  }, [linkedRecordType]);

  const selectButtonText = shouldSelect ? "case.select" : "case.deselect";
  const selectButtonIcon = shouldSelect ? <CheckIcon /> : <BlockIcon />;
  const backButtonText = shouldSelect ? "case.back_to_results" : "case.back_to_case";
  const backButtonFunc = shouldSelect ? handleReturn : handleCancel;

  const handleSelection = () => {
    [[linkField, shouldSelect ? id : null]].forEach(([key, value]) => {
      setFieldValue(key, value);
    });

    handleCancel();
  };

  return (
    <>
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
            onClick={handleSelection}
            icon={selectButtonIcon}
          />
        )}
      </div>
      {formSection?.unique_id && (
        <Form
          useCancelPrompt={false}
          mode={FORM_MODE_SHOW}
          formSections={[formSection]}
          initialValues={record.toJS()}
          showTitle={false}
        />
      )}
    </>
  );
}

Component.displayName = "ResultDetails";

Component.propTypes = {
  formName: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  handleReturn: PropTypes.func,
  id: PropTypes.string.isRequired,
  linkedRecordFormUniqueId: PropTypes.string.isRequired,
  linkedRecordType: PropTypes.string.isRequired,
  linkField: PropTypes.string.isRequired,
  linkFieldDisplay: PropTypes.string.isRequired,
  permissions: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  setDrawerTitle: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func,
  shouldSelect: PropTypes.bool,
  showSelectButton: PropTypes.bool
};

export default Component;
