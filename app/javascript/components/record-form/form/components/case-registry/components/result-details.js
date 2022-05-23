import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useEffect } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";

import { getRecordFormsByUniqueId } from "../../../..";
import { useMemoizedSelector } from "../../../../../../libs";
import { REGISTRY_RECORD, REGISTRY_RECORDS } from "../../../../../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";
import css from "../../../subforms/styles.css";
import { LINK_FIELD, REGISTRY_DETAILS } from "../constants";
import { fetchRecord, selectRecord } from "../../../../../records";
import Form, { FORM_MODE_SHOW } from "../../../../../form";
import DisabledRecordIndicator from "../../disabled-record-indicator";

const ResultDetails = ({
  id,
  handleCancel,
  shouldSelect = false,
  handleReturn,
  setDrawerTitle,
  mode,
  primeroModule,
  permissions,
  redirectIfNotAllowed,
  setFieldValue,
  formName
}) => {
  setDrawerTitle(formName, {}, false);
  redirectIfNotAllowed(permissions.writeReadRegistryRecord);

  const dispatch = useDispatch();

  const formSection = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: REGISTRY_DETAILS,
      primeroModule,
      recordType: REGISTRY_RECORD,
      getFirst: true
    })
  );

  const record = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow: true, recordType: REGISTRY_RECORDS, id })
  );

  useEffect(() => {
    dispatch(fetchRecord(REGISTRY_RECORDS, id));
  }, []);

  const selectButtonText = shouldSelect ? "case.select" : "case.deselect";
  const selectButtonIcon = shouldSelect ? <CheckIcon /> : <BlockIcon />;
  const backButtonText = shouldSelect ? "case.back_to_results" : "case.back_to_case";
  const backButtonFunc = shouldSelect ? handleReturn : handleCancel;

  const handleSelection = () => {
    [[LINK_FIELD, shouldSelect ? id : null]].forEach(([key, value]) => {
      setFieldValue(key, value);
    });

    handleCancel();
  };

  return (
    <>
      {!record.get("enabled") && <DisabledRecordIndicator recordType={REGISTRY_RECORD} />}
      <div className={css.subformFieldArrayContainer}>
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text={backButtonText}
          rest={{ onClick: backButtonFunc }}
          icon={<ArrowBackIosIcon />}
        />
        {permissions.writeRegistryRecord && !mode.isShow && (
          <ActionButton
            type={ACTION_BUTTON_TYPES.default}
            text={selectButtonText}
            onClick={handleSelection}
            icon={selectButtonIcon}
          />
        )}
      </div>
      <Form
        useCancelPrompt={false}
        mode={FORM_MODE_SHOW}
        formSections={[formSection]}
        initialValues={record.toJS()}
        showTitle={false}
      />
    </>
  );
};

ResultDetails.displayName = "ResultDetails";

ResultDetails.propTypes = {
  formName: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  handleReturn: PropTypes.func,
  id: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  setDrawerTitle: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func,
  shouldSelect: PropTypes.bool
};

export default ResultDetails;
