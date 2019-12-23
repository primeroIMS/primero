import React from "react";
import PropTypes from "prop-types";

import { FieldRecord, FormSectionField } from "../../record-form";

import { FIELDS } from "./constants";

const Fields = ({ recordType, activeStep, fields }) => {
  const renderFields =
    fields &&
    fields
      .filter(f => f.step === activeStep)
      .map(f => {
        const field = { ...f };

        delete field.step;
        const formattedField = FieldRecord(field);
        const fieldProps = {
          name: formattedField.name,
          field: formattedField,
          mode: {
            isShow: false,
            isEdit: true
          },
          recordType
        };

        return (
          <FormSectionField
            key={`${formattedField.name}-incident`}
            {...fieldProps}
          />
        );
      });

  return <>{renderFields}</>;
};

Fields.propTypes = {
  activeStep: PropTypes.number,
  fields: PropTypes.array,
  recordType: PropTypes.string
};

Fields.displayName = FIELDS;

export default Fields;
