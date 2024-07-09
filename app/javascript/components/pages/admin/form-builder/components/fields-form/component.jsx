// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import FormSection from "../../../../../form/components/form-section";

function Component({ fieldsForm, formMethods, formMode }) {
  return fieldsForm.map(formSection => (
    <FormSection formSection={formSection} key={formSection.unique_id} formMode={formMode} formMethods={formMethods} />
  ));
}

Component.displayName = "FieldsForm";

Component.propTypes = {
  fieldsForm: PropTypes.array,
  formMethods: PropTypes.object,
  formMode: PropTypes.object
};

export default Component;
