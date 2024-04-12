// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import clsx from "clsx";

import { ConditionalWrapper } from "../../../libs";
import useFormField from "../use-form-field";
import useOptions from "../use-options";
import formComponent from "../utils/form-component";

import css from "./styles.css";

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

  const classes = clsx(css.field, {
    [css.readonly]: formMode.isShow
  });

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
    handleVisibility() || (
      <ConditionalWrapper condition={Boolean(WrapWithComponent)} wrapper={WrapWithComponent}>
        <div data-testid="form-section-field" className={classes}>{renderField}</div>
      </ConditionalWrapper>
    )
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
