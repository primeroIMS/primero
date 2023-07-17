import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { FAMILY, MODULES } from "../../../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import Form, { FORM_MODE_SHOW, FormSectionRecord } from "../../../form";
import css from "../../../record-form/form/subforms/styles.css";
import { FAMILY_ID_DISPLAY, FAMILY_NAME, FAMILY_NUMBER, FORM_ID } from "../../constants";
import { useMemoizedSelector } from "../../../../libs";
import { getFieldByName } from "../../../record-form/selectors";

function Component({ handleCancel, record }) {
  const familyIdDisplayField = useMemoizedSelector(state =>
    getFieldByName(state, FAMILY_ID_DISPLAY, MODULES.CP, FAMILY)
  );
  const familyNumberField = useMemoizedSelector(state => getFieldByName(state, FAMILY_NUMBER, MODULES.CP, FAMILY));
  const familyNameField = useMemoizedSelector(state => getFieldByName(state, FAMILY_NAME, MODULES.CP, FAMILY));

  const formFields = [
    FormSectionRecord({
      unique_id: FORM_ID,
      fields: [familyIdDisplayField, familyNumberField, familyNameField]
    })
  ];

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text="case.back_to_case"
          rest={{ onClick: handleCancel }}
          icon={<ArrowBackIosIcon />}
        />
      </div>
      <Form formID={FORM_ID} formSections={formFields} mode={FORM_MODE_SHOW} initialValues={record.toJS()} />
    </>
  );
}

Component.displayName = "FamilyRecordForm";

Component.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired
};

export default Component;
