import PropTypes from "prop-types";

import { ConditionalWrapper } from "../../../libs";
import useFormField from "../use-form-field";
import useOptions from "../use-options";
import formComponent from "../utils/form-component";

const FormSectionField = ({ checkErrors, field, formMethods, formMode, disableUnderline }) => {
  const { errors } = formMethods;
  const {
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    handleVisibility,
    renderChildren = true,
    isNotVisible,
    metaInputProps,
    optionSelector
  } = useFormField(field, { checkErrors, errors, formMode, disableUnderline });

  const optionSource = useOptions(optionSelector());

  if (isNotVisible()) {
    return null;
  }

  const renderField = renderChildren && (
    <Field
      field={field}
      commonInputProps={commonInputProps}
      metaInputProps={metaInputProps}
      options={optionSource}
      errorsToCheck={errorsToCheck}
      formMethods={formMethods}
      formMode={formMode}
    />
  );

  return (
    <div>
      {handleVisibility() || (
        <ConditionalWrapper condition={Boolean(WrapWithComponent)} wrapper={WrapWithComponent}>
          {renderField}
        </ConditionalWrapper>
      )}
    </div>
  );
};

FormSectionField.displayName = "FormSectionField";

FormSectionField.defaultProps = {
  disableUnderline: false
};

FormSectionField.propTypes = {
  checkErrors: PropTypes.object,
  disableUnderline: PropTypes.bool,
  field: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired
};

export default formComponent(FormSectionField);
