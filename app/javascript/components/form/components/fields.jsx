import React from "react";
import clsx from "clsx";

import fieldKey from "../utils/field-key";
import formComponent from "../utils/form-component";

import FormSectionTabs from "./form-section-tabs";
import WatchedFormSectionField from "./watched-form-section-field";
import FormSectionField from "./form-section-field";

const Fields = ({ fields, checkErrors, disableUnderline, formSection, css, formMethods, formMode }) => {
  const calculatedClasses = equalColumns =>
    clsx({
      [css.notEqual]: equalColumns === false,
      [css.row]: true
    });

  return fields.map(field => {
    if (field?.row) {
      return (
        <div key={`${formSection.unique_id}-row`} className={calculatedClasses(field.equalColumns)}>
          <Fields
            fields={field.row}
            checkErrors={checkErrors}
            disableUnderline={disableUnderline}
            css={css}
            formMethods={formMethods}
            formMode={formMode}
            formSection={formSection}
          />
        </div>
      );
    }

    if (field?.tabs) {
      return <FormSectionTabs tabs={field.tabs} formMethods={formMethods} formMode={formMode} />;
    }

    const Component = field?.watchedInputs ? WatchedFormSectionField : FormSectionField;

    return (
      <Component
        field={field}
        disableUnderline={disableUnderline}
        key={fieldKey(field.name, field.internalFormFieldID)}
        checkErrors={checkErrors}
        formMethods={formMethods}
        formMode={formMode}
      />
    );
  });
};

export default formComponent(Fields);
