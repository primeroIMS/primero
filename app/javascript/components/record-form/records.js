import { Record } from "immutable";

export const FieldRecord = Record({
  name: "",
  type: "",
  editable: null,
  disabled: null,
  visible: null,
  display_name: {},
  subform_section: null,
  help_text: {}
});

export const FormSectionRecord = Record({
  id: "",
  name: {},
  visible: null,
  is_first_tab: null,
  order: null,
  order_form_group: null,
  parent: "",
  editable: null,
  module: [],
  form_group_id: "",
  fields: [],
  is_subform: null
});

export const NavRecord = Record({
  group: null,
  groupOrder: null,
  name: null,
  order: null,
  formId: null,
  is_first_tab: false
});
