reopened_subform = [
    Field.new({"name" => "reopened_date",
               "type" => "date_field",
               "editable"=>false,
               "disabled"=>true,
               "display_name_all" => "Date Reopened",
              }),
    Field.new({"name" => "reopened_user",
               "type" => "text_field",
               "editable"=>false,
               "disabled"=>true,
               "display_name_all" => "Reopened by",
              })
]

reopened_logs = FormSection.create_or_update_form_section({
     "visible"=>false,
     "is_nested"=>true,
     :order_form_group => 150,
     :order => 10,
     :order_subform => 1,
     :unique_id=>"reopened_logs",
     :parent_form=>"case",
     "editable"=>false,
     :fields => reopened_subform,
     "name_all" => "Case Reopened",
     "description_all" => "Case Reopened Subform",
     "collapsed_fields" => ["reopened_date", "reopened_user"],
     "display_help_text_view" => false
})

record_owner_fields = [
  #TODO: Move data to hardcoded record status panel

  #TODO: Get rid of
  Field.new({"name" => "current_owner_separator",
           "type" => "separator",
           "display_name_all" => "Current Owner",
          }),
  Field.new({"name" => "owned_by_text",
        "type" => "text_field",
        "display_name_all" => "Field/Case/Social Worker"
          }),
  Field.new({"name" => "owned_by",
             "type" =>"select_box" ,
             "display_name_all" => "Caseworker Code",
             "option_strings_source" => "User",
             "editable" => false,
             "disabled" => true
          }),
  #TODO reconcile difference between Agency and Other Agency
  #TODO: Move data to hardcoded record status panel
  Field.new({"name" => "agency_name",
             "type" =>"select_box" ,
             "display_name_all" => "Agency",
             "visible" => false,
             "option_strings_text_all" =>
                          ["German Technical Cooperation",
                           "GTZ",
                           "ICRC",
                           "International Rescue Committee",
                           "IRC",
                           "IRC K",
                           "IRC KV",
                           "IRC Legal",
                           "IRC NH",
                           "IRC NZ",
                           "IRC NZV",
                           "Save the Children",
                           "SCUK",
                           "SCUK-LF",
                           "SCUK-MOT",
                           "UNICEF",
                           "United Nations Childrens Fund"].join("\n")
            }),
  #TODO: Move data to hardcoded record status panel
  Field.new({"name" => "telephone_agency",
          "type" => "text_field",
          "visible" => false,
          "display_name_all" => "Agency Telephone"
           }),
  Field.new({"name" => "assigned_user_names",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_all" => "Other Assigned Users",
             "option_strings_source" => "User"
            }),
  #TODO spreadsheet says this comes from valid users
  Field.new({"name" => "database_operator_user_name",
             "type" =>"select_box",
             "display_name_all" => "Database Operator",
             "option_strings_source" => "User"
            }),
  Field.new({"name" => "address_registration",
           "type" => "textarea",
           "display_name_all" => "Registration Address"
          }),
 	Field.new({"name" => "location_registration",
        	"type" => "text_field",
        	"display_name_all" => "Location Address"
          }),
  #TODO: get rid of
 	Field.new({"name" => "record_history_separator",
           "type" => "separator",
           "display_name_all" => "Record History",
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "created_by",
        	"type" => "text_field",
          "display_name_all" => "Record created by",
          "editable" => false,
          "disabled" => true
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "created_by_agency",
        	"type" => "text_field",
        	"display_name_all" => "Created by agency"
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "previously_owned_by",
        	"type" => "text_field",
          "display_name_all" => "Previous Owner",
          "editable" => false,
          "disabled" => true
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "previous_agency",
        	"type" => "text_field",
        	"display_name_all" => "Previous Agency"
          }),
  #TODO: This is needed to preserve the module on record creation. Can we make this elegant?
  #TODO: Move data to hardcoded record status panel
  Field.new({"name" => "module_id",
          "type" => "text_field",
          "display_name_all" => "Module",
          "editable" => false,
          "disabled" => true
          }),
Field.new({"name" => "reopened_logs",
           "type" => "subform",
           "editable" => false,
           "disabled" => true,
           "subform_section_id" => reopened_logs.unique_id,
           "display_name_all" => "Case Reopened",
           "subform_sort_by" => "reopened_date"
          })
]

FormSection.create_or_update_form_section({
  :unique_id=>"record_owner",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 0,
  :order => 0,
  :order_subform => 0,
  :form_group_name => "Record Information",
  "editable" => true,
  :fields => record_owner_fields,
  :mobile_form => false,
  "name_all" => "Record Information",
  "description_all" => "Record Information"
})
