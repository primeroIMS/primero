import React from "react";
import PropTypes from "prop-types";
import { connect } from "formik";

import { FieldRecord, FormSectionField } from "../../../record-form";

import { NAME } from "./constants";

const Component = ({ recordType, fields, formik }) => {
  const {
    service_type: service,
    service_implementing_agency: agency,
    service_delivery_location: location
  } = formik.values;
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
        recordType,
        filters: { service, agency, location }
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
  formik: PropTypes.object,
  recordType: PropTypes.string
};

Component.displayName = NAME;

export default connect(Component);
