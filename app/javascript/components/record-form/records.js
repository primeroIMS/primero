// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Record, fromJS } from "immutable";

export const FieldRecord = Record({
  autosum_total: true,
  collapse: null,
  date_include_time: false,
  date_validation: null,
  disabled: null,
  display_conditions_record: undefined,
  display_conditions_subform: undefined,
  display_name: {},
  editable: null,
  form_section_id: null,
  form_section_name: null,
  guiding_questions: "",
  help_text: {},
  hidden_text_field: false,
  hide_on_view_page: false,
  href: null,
  link_to_form: "",
  module_ids: null,
  multi_select: null,
  name: "",
  option_strings_condition: null,
  option_strings_source: null,
  option_strings_text: null,
  order: null,
  parent_form: null,
  required: false,
  selected_value: null,
  show_on_minify_form: false,
  showIf: null,
  subform_section_configuration: null,
  subform_section_id: null,
  subform_sort_by: "",
  subform_summary: null,
  tally: {},
  tick_box_label: {},
  type: "",
  visible: null,
  watchedInputs: null,
  calculation: {}
});

export const FormSectionRecord = Record({
  collapsed_field_names: [],
  core_form: false,
  display_conditions: [],
  description: fromJS({}),
  editable: null,
  fields: [],
  form_group_id: "",
  i18nDescription: false,
  i18nName: false,
  id: "",
  initial_subforms: 0,
  is_first_tab: null,
  is_nested: null,
  module_ids: [],
  name: {},
  order_form_group: null,
  order: null,
  parent_form: "",
  subform_append_only: false,
  subform_prevent_item_removal: false,
  unique_id: "",
  visible: null,
  userPermission: null
});

export const Option = Record({
  options: [],
  type: ""
});

export const NavRecord = Record({
  display_conditions: [],
  formId: null,
  group: null,
  groupName: null,
  groupOrder: null,
  i18nDescription: false,
  i18nName: false,
  is_first_tab: false,
  name: null,
  order: null,
  permission_actions: [],
  recordTypes: []
});
