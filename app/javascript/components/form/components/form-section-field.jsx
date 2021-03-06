import PropTypes from "prop-types";
import { isImmutable } from "immutable";

import { ConditionalWrapper, useMemoizedSelector } from "../../../libs";
import useFormField from "../use-form-field";
import formComponent from "../utils/form-component";

const FormSectionField = ({ checkErrors, field, formMethods, formMode, disableUnderline }) => {
  const { errors } = formMethods;
  const {
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    handleVisibility,
    isNotVisible,
    metaInputProps,
    optionSelector
  } = useFormField(field, { checkErrors, errors, formMode, disableUnderline });

  const optionSource = useMemoizedSelector(state => optionSelector(state));
  const options = isImmutable(optionSource) ? optionSource?.toJS() : optionSource;

  if (isNotVisible()) {
    return null;
  }

  return (
    <div>
      {handleVisibility() || (
        <ConditionalWrapper condition={Boolean(WrapWithComponent)} wrapper={WrapWithComponent}>
          <Field
            field={field}
            commonInputProps={commonInputProps}
            metaInputProps={metaInputProps}
            options={options}
            errorsToCheck={errorsToCheck}
            formMethods={formMethods}
            formMode={formMode}
          />
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
