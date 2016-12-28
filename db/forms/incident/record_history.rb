record_history_fields = [
  Field.new({"name" => "record_history_section",
             "type" => "separator",
             "display_name_all" => "Record History"
            }),
  Field.new({"name" => "caseworker_name",
             "type" => "text_field",
             "display_name_all" => "Incident creator",
             "help_text_all" => "This is the MRM Specialist who entered the incident in the database"
            }),
  Field.new({"name" => "owned_by",
             "type" => "select_box",
             "display_name_all" => "Incident creator's code (if applicable)",
             "option_strings_source" => "User",
             "editable" => false,
             "disabled" => true
            }),
  Field.new({"name" => "assigned_user_names",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_all" => "Other assigned MRMIMS+ users",
             "option_strings_source" => "User"
            }),
  Field.new({"name" => "created_organization",
             "type" => "text_field",
             "display_name_all" => "CTFMR member",
             "editable" => false,
             "disabled" => true
            }),
  Field.new({"name" => "mrm_monitor",
             "type" => "text_field",
             "display_name_all" => "MRM monitor",
             "help_text_all" => "This is the MRM monitor who collected information on the incident "
            }),
  Field.new({"name" => "mrm_monitor_code",
             "type" => "text_field",
             "display_name_all" => "MRM monitor's code (if applicable)"
            }),
  Field.new({"name" => "ctfmr_member",
             "type" => "text_field",
             "display_name_all" => "CTFMR member/partner"
            }),
  #TODO: This is needed to preserve the module on record creation. Can we make this elegant?
  #TODO: Move data to hardcoded record status panel
  Field.new({"name" => "module_id",
             "type" => "text_field",
             "display_name_all" => "Module",
             "editable" => false,
             "disabled" => true
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "incident_record_history",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 0,
  :order => 0,
  :order_subform => 0,
  :form_group_name => "Record History",
  "editable" => true,
  :fields => record_history_fields,
  "name_all" => "Record History",
  "description_all" => "Record History"
})
