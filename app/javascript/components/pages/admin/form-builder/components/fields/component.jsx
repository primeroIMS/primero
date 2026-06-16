import PropTypes from "prop-types";

import FieldListItem from "../field-list-item";

function Component({ canManage, fields, formMethods, subformField, subformGroupBy, subformSortBy }) {
  return fields.map((field, index) => {
    const id = field.get("id") || field.get("subform_section_temp_id");

    return (
      <FieldListItem
        canManage={canManage}
        formMethods={formMethods}
        subformField={subformField}
        field={field}
        index={index}
        subformSortBy={subformSortBy}
        subformGroupBy={subformGroupBy}
        key={`${field.get("name")}_${id}`}
      />
    );
  });
}

Component.displayName = "Fields";

Component.propTypes = {
  canManage: PropTypes.bool,
  fields: PropTypes.object,
  formMethods: PropTypes.object,
  subformField: PropTypes.object,
  subformGroupBy: PropTypes.string,
  subformSortBy: PropTypes.string
};

export default Component;
