import clsx from "clsx";

import fieldKey from "../utils/field-key";
import formComponent from "../utils/form-component";

import FormSectionTabs from "./form-section-tabs";
import WatchedFormSectionField from "./watched-form-section-field";
import FormSectionField from "./form-section-field";

const Fields = ({ fields, checkErrors, disableUnderline, formSection, css, formMethods, formMode }) => {
  const calculatedClasses = field =>
    clsx({
      [css.notEqual]: field.equalColumns === false,
      [css.row]: !field?.customRowStyle,
      [css.rowCustom]: field?.customRowStyle,
      [css.headerCustom]: field?.customHeaderStyle
    });

  return fields.map(field => {
    if (field?.row) {
      // eslint-disable-next-line camelcase
      const formUniqueId = formSection?.unique_id || field?.unique_id;

      return (
        <div key={`${formUniqueId}-row`} className={calculatedClasses(field)}>
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
      return (
        <FormSectionTabs
          tabs={field.tabs}
          handleTabChange={field?.handleTabChange}
          formMethods={formMethods}
          formMode={formMode}
        />
      );
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
