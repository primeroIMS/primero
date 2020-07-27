import React, { useState } from "react";
import PropTypes from "prop-types";
import { getIn, connect } from "formik";
import { Box } from "@material-ui/core";

import FormSectionField from "../../form-section-field";

import { NAME } from "./constants";

const Component = ({ formik, field, index, mode }) => {
  const [filterState, setFilterState] = useState({
    filtersChanged: false,
    userIsSelected: false
  });

  const filters = (subform, optionStringsSource) => {
    switch (optionStringsSource) {
      case "Agency":
        return {
          service: getIn(formik.values, `service_type`)
        };
      case "User":
        return {
          service: getIn(formik.values, `service_type`),
          location: getIn(formik.values, `service_delivery_location`),
          agency: getIn(formik.values, `service_implementing_agency`)
        };
      default:
        return {};
    }
  };

  return (
    <>
      {field.subform_section_id.fields.map(f => {
        const fieldProps = {
          name: f.name,
          field: f,
          mode,
          index,
          parentField: field,
          filters: {
            values: filters(field, f.option_strings_source),
            filterState,
            setFilterState
          }
        };

        return (
          <Box my={3} key={f.name}>
            <FormSectionField {...fieldProps} />
          </Box>
        );
      })}
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  mode: PropTypes.object.isRequired
};

export default connect(Component);
