// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (parentForm, subformName) =>
  // eslint-disable-next-line camelcase
  parentForm && parentForm.fields.find(field => field.name === subformName)?.subform_section_id;
