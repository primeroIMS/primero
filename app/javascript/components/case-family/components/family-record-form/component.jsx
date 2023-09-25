import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import Form, { FORM_MODE_SHOW } from "../../../form";
import css from "../../../record-form/form/subforms/styles.css";
import { FORM_ID } from "../../constants";
import { useI18n } from "../../../i18n";

import form from "./form";

function Component({ handleCancel, record }) {
  const i18n = useI18n();
  const familyRecordForm = form(i18n, record.get("id"));
  const initialValues = {
    family_id_display: record.get("family_id_display"),
    family_number: record.get("family_number"),
    family_name: record.get("family_name")
  };

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
      <Form formID={FORM_ID} formSections={familyRecordForm} mode={FORM_MODE_SHOW} initialValues={initialValues} />
    </>
  );
}

Component.displayName = "FamilyRecordForm";

Component.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired
};

export default Component;
