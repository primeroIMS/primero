import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";

import { SUBFORM_SECTION } from "../../constants";

const sortSubformsValues = (values, fields) => {
  const result = Object.entries(values).reduce((acc, curr) => {
    const [key, value] = curr;
    const subformField = fields.find(field => field.name === key && field.type === SUBFORM_SECTION);
    // eslint-disable-next-line camelcase
    const sortField = subformField?.subform_section_configuration?.subform_sort_by;

    if (!subformField || !sortField) {
      return { ...acc, [key]: value };
    }

    const orderedValues = orderBy(value, [sortField], ["asc"]);

    return { ...acc, [key]: orderedValues };
  }, {});

  return result;
};

// This method checks if the form is dirty or not. With the existing behavior
// of 'dirty' prop from formik when you update a subform, the form never gets
// 'dirty'. Also, subforms are sorted before comparing them because the subforms
// that are set into the 'initialValues' they got a different order than current
// values (formik.getValues()).

export default (initialValues, currentValues, fields) => {
  if (isEmpty(fields)) {
    return false;
  }

  return !isEqual(sortSubformsValues(initialValues, fields), sortSubformsValues(currentValues, fields));
};
