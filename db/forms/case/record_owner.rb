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
             "option_strings_source" => "User"
          }),
  #TODO reconcile difference between Agency and Other Agency
  #TODO: Move data to hardcoded record status panel
  Field.new({"name" => "agency",
             "type" =>"select_box" ,
             "display_name_all" => "Agency",
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
          "display_name_all" => "Agency Telephone"
           }),
  #TODO get list from valid users
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
        	"display_name_all" => "Record created by"
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "created_by_agency",
        	"type" => "text_field",
        	"display_name_all" => "Created by agency"
          }),
  #TODO: Move data to hardcoded record status panel
 	Field.new({"name" => "previously_owned_by",
        	"type" => "text_field",
        	"display_name_all" => "Previous Owner"
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
          "display_name_all" => "Module"
          })
]

FormSection.create_or_update_form_section({
  :unique_id=>"record_owner",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 0,
  :order => 0,
  :order_subform => 0,
  :form_group_name => "Record Owner",
  "editable" => true,
  :fields => record_owner_fields,
  "name_all" => "Record Owner",
  "description_all" => "Record Owner"
})
