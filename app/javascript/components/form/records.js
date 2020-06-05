import { Record, Map, List } from "immutable";

export const FieldRecord = Record({
  name: "",
  type: "",
  editable: true,
  disabled: null,
  visible: null,
  display_name: Map({}),
  subform_section_id: null,
  help_text: Map({}),
  multi_select: null,
  option_strings_source: null,
  option_strings_text: null,
  guiding_questions: "",
  required: false,
  date_validation: null,
  hide_on_view_page: false,
  date_include_time: false,
  selected_value: "",
  subform_sort_by: "",
  show_on_minify_form: false,
  autoFocus: false,
  password: false,
  hideOnShow: false,
  inputClassname: null,
  inlineCheckboxes: false,
  freeSolo: false,
  watchedInputs: null,
  handleWatchedInputs: null,
  check_errors: List([]),
  hint: "",
  groupBy: null
});

export const FormSectionRecord = Record({
  id: "",
  unique_id: "",
  name: Map({}),
  visible: null,
  is_first_tab: null,
  order: null,
  order_form_group: null,
  parent_form: "",
  editable: null,
  module_ids: List([]),
  form_group_id: "",
  form_group_name: "",
  fields: List([]),
  is_nested: null,
  subform_append_only: false,
  subform_prevent_item_removal: false,
  initial_subforms: 0,
  collapsed_field_names: List([]),
  check_errors: List([]),
  expandable: false,
  expanded: false
});

export const Option = Record({
  type: "",
  options: List([])
});
