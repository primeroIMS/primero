export default [
  {
    name: "current_owner_separator",
    type: "separator"
  },
  {
    name: "owned_by_text",
    type: "text_field",
    visible: true
  },
  {
    name: "owned_by",
    type: "text_field",
    visible: true
  },
  {
    name: "reassigned_tranferred_on",
    type: "text_field",
    visible: true
  },
  {
    name: "owned_by_agency_id",
    type: "select_box",
    option_strings_source: "Agency",
    visible: true
  },
  {
    // TODO: When the endpoint for user is ready, change the type to select_box and add option_strings_source: "User"
    name: "assigned_user_names",
    type: "text_field",
    visible: true
  },
  {
    name: "record_history_separator",
    type: "separator"
  },
  {
    name: "created_by",
    type: "text_field",
    visible: true
  },
  {
    name: "created_by_agency",
    type: "text_field",
    visible: true
  },
  {
    name: "previously_owned_by",
    type: "text_field",
    visible: true
  },
  {
    name: "previous_agency",
    type: "text_field",
    visible: true
  },
  {
    name: "module_id",
    type: "text_field",
    visible: true
  }
];
