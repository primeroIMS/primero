import React, { useState } from "react";
import PropTypes from "prop-types";
import { getIn } from "formik";
import { Box } from "@material-ui/core";

import FormSectionField from "../../form-section-field";

import { NAME } from "./constants";

const Component = ({ field, formik, index, mode }) => {
  const [filterState, setFilterState] = useState({
    filtersChanged: false,
    userIsSelected: false
  });

  const filters = (subform, optionStringsSource, subformIndex) => {
    switch (optionStringsSource) {
      case "Agency":
        return {
          service: getIn(
            formik.values,
            `${subform.name}[${subformIndex}].service_type`
          )
        };
      case "User":
        return {
          service: getIn(
            formik.values,
            `${subform.name}[${subformIndex}].service_type`
          ),
          location: getIn(
            formik.values,
            `${subform.name}[${subformIndex}].service_delivery_location`
          ),
          agency: getIn(
            formik.values,
            `${subform.name}[${subformIndex}].service_implementing_agency`
          )
        };
      default:
        return {};
    }
  };

  return (
    <>
      {field.subform_section_id.fields.map(f => {
        const fieldProps = {
          name: `${field.name}[${index}].${f.name}`,
          field: f,
          mode,
          index,
          parentField: field,
          filters: {
            values: filters(field, f.option_strings_source, index),
            filterState,
            setFilterState
          }
        };

        if (!f?.visible) {
          return null;
        }

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

export default Component;
