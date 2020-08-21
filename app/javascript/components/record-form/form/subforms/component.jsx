import React from "react";
import PropTypes from "prop-types";
import { FieldArray, connect } from "formik";

import { useI18n } from "../../../i18n";
import { constructInitialValues } from "../../utils";

import SubformFieldArray from "./subform-field-array";
import { SUBFORM_FIELD } from "./constants";

const Component = ({ field, form, formik, mode, recordType, formSection }) => {
  const { name, subform_section_id: subformSectionID } = field;

  const i18n = useI18n();

  const initialSubformValue = constructInitialValues([subformSectionID]);

  return (
    <>
      <FieldArray name={name} validateOnChange={false}>
        {arrayHelpers => (
          <SubformFieldArray
            arrayHelpers={arrayHelpers}
            field={field}
            form={form}
            formik={formik}
            i18n={i18n}
            initialSubformValue={initialSubformValue}
            mode={mode}
            recordType={recordType}
            formSection={formSection}
          />
        )}
      </FieldArray>
    </>
  );
};

Component.displayName = SUBFORM_FIELD;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  recordType: PropTypes.string
};

export default connect(Component);
