reopened_subform = [
    Field.new({"name" => "reopened_date",
               "type" => "date_field",
               "editable"=>false,
               "disabled"=>true,
               "display_name_en" => "Date Reopened",
              }),
    Field.new({"name" => "reopened_user",
               "type" => "text_field",
               "editable"=>false,
               "disabled"=>true,
               "display_name_en" => "Reopened by",
              })
]

reopened_logs = FormSection.create_or_update_form_section({
     "visible"=>false,
     "is_nested"=>true,
     :mobile_form => true,
     :order_form_group => 150,
     :order => 10,
     :order_subform => 1,
     :unique_id=>"reopened_logs",
     :parent_form=>"case",
     "editable"=>false,
     :fields => reopened_subform,
     "name_en" => "Case Reopened",
     "description_en" => "Case Reopened Subform",
     "collapsed_field_names" => ["reopened_date", "reopened_user"],
     "display_help_text_view" => false
})

record_owner_fields = [
  #TODO: Move data to hardcoded record status panel

  #TODO: Get rid of
  Field.new({"name" => "current_owner_separator",
           "mobile_visible" => false,
           "type" => "separator",
           "display_name_en" => "Current Owner",
          }),
  Field.new({"name" => "owned_by_text",
        "type" => "text_field",
        "show_on_minify_form" => true,
        "mobile_visible" => true,
        "display_name_en" => "Field/Case/Social Worker"
          }),
  Field.new({"name" => "owned_by",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" =>"select_box" ,
             "display_name_en" => "Caseworker Code",
             "option_strings_source" => "User",
             "editable" => false,
             "disabled" => true
          }),
  Field.new({"name" => "reassigned_tranferred_on",
            "type" => "date_field",
            "display_name_en" => "Reassigned / Transferred On",
            "date_include_time" => true,
            "editable" => false,
            "disabled" => true
          }),
  Field.new({"name" => "owned_by_agency_id",
             "type" => "select_box",
             "mobile_visible" => false,
             "display_name_en" => "Agency",
             "editable" => false,
             "disabled" => true,
             "option_strings_source" => "Agency"
            }),
  #TODO: Move data to hardcoded record status panel
  Field.new({"name" => "telephone_agency",
          "mobile_visible" => false,
          "type" => "text_field",
          "visible" => false,
          "display_name_en" => "Agency Telephone"
           }),
  Field.new({"name" => "assigned_user_names",
             "mobile_visible" => false,
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_en" => "Other Assigned Users",
             "option_strings_source" => "User"
            }),
  #TODO spreadsheet says this comes from valid users
  Field.new({"name" => "database_operator_user_name",
             "mobile_visible" => false,
             "type" =>"select_box",
             "display_name_en" => "Database Operator",
             "option_strings_source" => "User",
             "visible" => false
            }),
  Field.new({"name" => "address_registration",
           "mobile_visible" => false,
           "type" => "textarea",
           "display_name_en" => "Registration Address",
           "visible" => false
          }),
  Field.new({"name" => "location_registration",
          "mobile_visible" => false,
          "type" => "text_field",
          "display_name_en" => "Location Address",
          "visible" => false
          }),
  #TODO: get rid of
 	Field.new({"name" => "record_history_separator",
           "mobile_visible" => false,
           "type" => "separator",
           "display_name_en" => "Record History",
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "created_by",
          "mobile_visible" => false,
          "type" => "text_field",
          "display_name_en" => "Record created by",
          "editable" => false,
          "disabled" => true
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "created_by_agency",
          "mobile_visible" => false,
          "type" => "text_field",
          "display_name_en" => "Created by agency",
          "disabled" => true
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "previously_owned_by",
          "mobile_visible" => false,
          "type" => "text_field",
          "display_name_en" => "Previous Owner",
          "editable" => false,
          "disabled" => true
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "previous_agency",
          "mobile_visible" => false,
          "type" => "text_field",
          "display_name_en" => "Previous Agency",
          "disabled" => true
          }),
  #TODO: This is needed to preserve the module on record creation. Can we make this elegant?
  #TODO: Move data to hardcoded record status panel
  Field.new({"name" => "module_id",
          "mobile_visible" => false,
          "type" => "text_field",
          "display_name_en" => "Module",
          "editable" => false,
          "disabled" => true
          }),
Field.new({"name" => "reopened_logs",
           "mobile_visible" => false,
           "type" => "subform",
           "editable" => false,
           "disabled" => true,
           "subform_section" => reopened_logs,
           "display_name_en" => "Case Reopened",
           "subform_sort_by" => "reopened_date"
          })
]

FormSection.create_or_update_form_section({
  :unique_id=>"record_owner",
  :parent_form=>"case",
  "visible" => false,
  :order_form_group => 0,
  :order => 0,
  :order_subform => 0,
  :form_group_id => "record_information",
  "editable" => true,
  :fields => record_owner_fields,
  :mobile_form => true,
  "name_en" => "Record Information",
  "description_en" => "Record Information"
})
