import PropTypes from "prop-types";
import { FieldArray, connect } from "formik";

import { useI18n } from "../../../i18n";

import SubformFieldArray from "./subform-field-array";
import { SUBFORM_FIELD } from "./constants";

const Component = ({
  forms,
  field,
  form,
  formik,
  mode,
  recordType,
  recordModuleID,
  formSection,
  isReadWriteForm,
  parentTitle,
  violationOptions
}) => {
  const { name } = field;

  const i18n = useI18n();

  return (
    <>
      <FieldArray name={name} validateOnChange={false}>
        {arrayHelpers => (
          <SubformFieldArray
            arrayHelpers={arrayHelpers}
            field={field}
            form={form}
            forms={forms}
            formik={formik}
            i18n={i18n}
            mode={mode}
            recordModuleID={recordModuleID}
            recordType={recordType}
            formSection={formSection}
            isReadWriteForm={isReadWriteForm}
            parentTitle={parentTitle}
            violationOptions={violationOptions}
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
  forms: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  isReadWriteForm: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  parentTitle: PropTypes.string,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string,
  violationOptions: PropTypes.array
};

export default connect(Component);
