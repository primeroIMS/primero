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
  parentValues,
  violationOptions,
  renderAsAccordion,
  entryFilter = false,
  customTitle = false
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
            parentValues={parentValues}
            violationOptions={violationOptions}
            renderAsAccordion={renderAsAccordion}
            entryFilter={entryFilter}
            customTitle={customTitle}
          />
        )}
      </FieldArray>
    </>
  );
};

Component.displayName = SUBFORM_FIELD;

Component.propTypes = {
  customTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  entryFilter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  forms: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  isReadWriteForm: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  parentTitle: PropTypes.string,
  parentValues: PropTypes.object,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string,
  renderAsAccordion: PropTypes.bool,
  violationOptions: PropTypes.array
};

export default connect(Component);
