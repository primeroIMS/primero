import React from "react";
import PropTypes from "prop-types";
import { connect } from "formik";

import FormSectionField from "../../form-section-field";

import { NAME } from "./constants";

const Component = ({
  mode,
  index,
  filterFunc,
  filterState,
  setFilterState,
  field
}) => {
  return field.subform_section_id.fields.map(subformSectionField => {
    const fieldProps = {
      name: subformSectionField.name,
      field: subformSectionField,
      mode,
      index,
      parentField: field,
      filters:
        filterFunc && filterState && setFilterState
          ? {
              values: filterFunc(field, subformSectionField),
              filterState,
              setFilterState
            }
          : {}
    };

    return (
      <div key={subformSectionField.name}>
        <FormSectionField {...fieldProps} />
      </div>
    );
  });
};

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  filterFunc: PropTypes.func,
  filterState: PropTypes.object,
  index: PropTypes.number.isRequired,
  mode: PropTypes.object.isRequired,
  setFilterState: PropTypes.func
};

export default connect(Component);
