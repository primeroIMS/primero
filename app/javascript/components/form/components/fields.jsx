import React from "react";
import clsx from "clsx";

import fieldKey from "../utils/field-key";

import FormSectionTabs from "./form-section-tabs";
import WatchedFormSectionField from "./watched-form-section-field";
import FormSectionField from "./form-section-field";

const Fields = ({ fields, checkErrors, disableUnderline, formSection, css }) => {
  const calculatedClasses = equalColumns =>
    clsx({
      [css.notEqual]: equalColumns === false,
      [css.row]: true
    });

  return fields.map(field => {
    if (field?.row) {
      return (
        <div key={`${formSection.unique_id}-row`} className={calculatedClasses(field.equalColumns)}>
          <Fields fields={field.row} checkErrors={checkErrors} disableUnderline={disableUnderline} css={css} />
        </div>
      );
    }

    if (field?.tabs) {
      return <FormSectionTabs tabs={field.tabs} />;
    }

    const Component = field?.watchedInputs ? WatchedFormSectionField : FormSectionField;

    return (
      <Component
        field={field}
        disableUnderline={disableUnderline}
        key={fieldKey(field.name, field.internalFormFieldID)}
        checkErrors={checkErrors}
      />
    );
  });
};

export default Fields;
