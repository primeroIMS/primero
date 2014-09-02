record_owner_fields = [
  Field.new({"name" => "record_state",
           "type" => "select_box",
           "display_name_all" => "Record state",
           "option_strings_text_all" =>
                        ["Valid record",
                         "Invalid record"].join("\n")
          }),
  Field.new({"name" => "current_owner_separator",
           "type" => "separator",
           "display_name_all" => "Current Owner",
          }),
  Field.new({"name" => "social_worker_case",
        "type" => "text_field",
        "display_name_all" => "Field/Case/Social Worker"
          }),
  Field.new({"name" => "social_worker",
             "type" =>"select_box" ,
             "display_name_all" => "Caseworker Code",
             "option_strings_text_all" =>
                          ["Social Worker 1",
                           "Social Worker 2",
                           "Social Worker 3",
                           "Social Worker 4"].join("\n")
          }),
  #TODO reconcile difference between Agency and Other Agency
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
  Field.new({"name" => "telephone_agency",
          "type" => "text_field",
          "display_name_all" => "Agency Telephone"
           }),
  #TODO spreadsheet says this comes from valid users
  Field.new({"name" => "database_operator",
             "type" =>"select_box" ,
             "display_name_all" => "Database Operator",
             "option_strings_text_all" =>
                          ["Operator 1",
                           "Operator 2",
                           "Operator 3",
                           "Operator 4"].join("\n")
            }),
  Field.new({"name" => "address_registration",
           "type" => "textarea",
           "display_name_all" => "Registration Address"
          }),
 	Field.new({"name" => "location_registration",
        	"type" => "text_field",
        	"display_name_all" => "Location Address"
          }),
 	Field.new({"name" => "record_history_separator",
           "type" => "separator",
           "display_name_all" => "Record History",
          }),
 	Field.new({"name" => "created_by",
        	"type" => "text_field",
        	"display_name_all" => "Record created by"
          }),
 	Field.new({"name" => "created_by_agency",
        	"type" => "text_field",
        	"display_name_all" => "Created by agency"
          }),
 	Field.new({"name" => "previous_owner",
        	"type" => "text_field",
        	"display_name_all" => "Previous Owner"
          }),
 	Field.new({"name" => "previous_agency",
        	"type" => "text_field",
        	"display_name_all" => "Previous Agency"
          }),
  Field.new({"name" => "module_id",
          "type" => "text_field",
          "display_name_all" => "Module"
          }),
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
