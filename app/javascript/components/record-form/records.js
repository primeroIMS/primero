import { Record, fromJS } from "immutable";

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
  guiding_questions: "",
  required: false,
  date_validation: null,
  hide_on_view_page: false,
  date_include_time: false,
  selected_value: null,
  subform_sort_by: "",
  show_on_minify_form: false,
  order: null,
  subform_section_configuration: null,
  tick_box_label: {},
  link_to_form: "",
  href: null
});

export const FormSectionRecord = Record({
  id: "",
  unique_id: "",
  description: fromJS({}),
  name: {},
  visible: null,
  is_first_tab: null,
  order: null,
  order_form_group: null,
  parent_form: "",
  editable: null,
  module_ids: [],
  form_group_id: "",
  fields: [],
  is_nested: null,
  subform_prevent_item_removal: false,
  collapsed_field_names: [],
  subform_append_only: false,
  initial_subforms: 0,
  core_form: false,
  i18nName: false,
  i18nDescription: false
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
  is_first_tab: false,
  permission_actions: [],
  recordTypes: [],
  i18nName: false,
  i18nDescription: false
});
