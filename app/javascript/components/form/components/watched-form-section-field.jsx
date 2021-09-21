import PropTypes from "prop-types";
import { useWatch } from "react-hook-form";

import { ConditionalWrapper } from "../../../libs";
import useFormField from "../use-form-field";
import useOptions from "../use-options";
import formComponent from "../utils/form-component";

const WatchedFormSectionField = ({ checkErrors, field, formMethods, formMode, disableUnderline }) => {
  const { control, errors, getValues } = formMethods;

  const {
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    handleVisibility,
    renderChildren = true,
    isNotVisible,
    metaInputProps,
    optionSelector,
    error
  } = useFormField(field, { checkErrors, errors, formMode, disableUnderline });

  const { watchedInputs, handleWatchedInputs, name } = field;
  const watchedInputValues = useWatch({
    control,
    name: watchedInputs
  });

  const watchedInputProps = handleWatchedInputs
    ? handleWatchedInputs(watchedInputValues, name, { error, methods: formMethods })
    : {};

  const optionSource = useOptions(optionSelector(watchedInputValues || getValues(watchedInputs)));

  const commonProps = {
    ...commonInputProps,
    ...watchedInputProps
  };

  const metaProps = {
    ...metaInputProps,
    groupBy: watchedInputProps?.groupBy || metaInputProps?.groupBy,
    watchedInputValues
  };

  if (isNotVisible(watchedInputProps)) {
    return null;
  }

  const renderField = renderChildren && (
    <Field
      field={field}
      commonInputProps={commonProps}
      metaInputProps={metaProps}
      options={optionSource}
      errorsToCheck={errorsToCheck}
      formMethods={formMethods}
      formMode={formMode}
    />
  );

  return (
    <div>
      {handleVisibility(watchedInputValues) || (
        <ConditionalWrapper condition={Boolean(WrapWithComponent)} wrapper={WrapWithComponent}>
          {renderField}
        </ConditionalWrapper>
      )}
    </div>
  );
};

WatchedFormSectionField.displayName = "WatchedFormSectionField";

WatchedFormSectionField.defaultProps = {
  disableUnderline: false
};

WatchedFormSectionField.propTypes = {
  checkErrors: PropTypes.object,
  disableUnderline: PropTypes.bool,
  field: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired
};

export default formComponent(WatchedFormSectionField);
