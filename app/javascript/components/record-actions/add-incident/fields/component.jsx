import React from "react";
import PropTypes from "prop-types";

import { FieldRecord, FormSectionField } from "../../../record-form";

import { NAME } from "./constants";

const Component = ({ recordType, fields }) => {
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

Component.propTypes = {
  fields: PropTypes.array,
  recordType: PropTypes.string
};

Component.displayName = NAME;

export default Component;
