import React from "react";
import PropTypes from "prop-types";

import { FieldRecord, FormSectionField } from "../../record-form";

import { FIELDS_NAME } from "./constants";

const Fields = ({ recordType, fields }) => {
  const renderFields =
    fields &&
    fields.map(f => {
      const field = { ...f };

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
  fields: PropTypes.array,
  recordType: PropTypes.string
};

Fields.displayName = FIELDS_NAME;

export default Fields;
