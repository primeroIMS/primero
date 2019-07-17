import { Record } from "immutable";

export const FieldRecord = Record({
  name: "",
  type: "",
  editable: null,
  disabled: null,
  visible: null,
  display_name: {},
  subform_section_id: null,
  help_text: {},
  multi_select: null,
  option_strings_source: null,
  option_strings_text: null,
  guiding_questions: ""
});

export const FormSectionRecord = Record({
  id: "",
  unique_id: "",
  name: {},
  visible: null,
  is_first_tab: null,
  order: null,
  order_form_group: null,
  parent_form: "",
  editable: null,
  module_ids: [],
  form_group_id: "",
  form_group_name: "",
  fields: [],
  is_nested: null
});

export const Option = Record({
  type: "",
  options: []
});

export const NavRecord = Record({
  group: null,
  groupName: null,
  groupOrder: null,
  name: null,
  order: null,
  formId: null,
  is_first_tab: false
});
