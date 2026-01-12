// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useFormikContext } from "formik";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";

import childFunctioningFormDataTemplate from "../../../../child-functioning-form/child-functioning-form-data";

function ChildFunctioningFormEffects({ field }) {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (fromJS(field.subform_section_id.unique_id) !== "child_functioning_subform_section") return;

    const age = values?.cfm_age;

    if (!age) return;

    Object.entries(childFunctioningFormDataTemplate).forEach(([controller, dependents]) => {
      const controllerKey = `cfm_${age}_${controller}`;

      if (values?.[controllerKey] === false) {
        dependents.forEach(dep => {
          const depKey = `cfm_${age}_${dep}`;

          if (values?.[depKey]) setFieldValue(depKey, "");
        });
      }
    });
  }, [values, setFieldValue, field]);

  // This component renders nothing, it just runs the effect
  return null;
}

ChildFunctioningFormEffects.displayName = "ChildFunctioningFormEffects";

ChildFunctioningFormEffects.propTypes = {
  field: PropTypes.shape({
    subform_section_id: PropTypes.shape({
      unique_id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default ChildFunctioningFormEffects;
