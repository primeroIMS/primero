basic_identity_fields = [
  Field.new({"name" => "case_id",
             "type" => "text_field", "editable" => false,
             "display_name_all" => "Case ID"
            }),
  Field.new({"name" => "short_id",
             "type" => "text_field", "editable" => false,
             "display_name_all" => "Short ID"
            }),
  Field.new({"name" => "name",
            "type" => "text_field",
            "display_name_all" => "Name",
            "highlight_information" => HighlightInformation.new("highlighted" => true,"order"=>1),
            }),
  Field.new({"name" => "age",
             "type" => "text_field",
             "display_name_all" => "Age"
            }),
  Field.new({"name" => "date_of_birth",
            "type" => "date_field",
            "display_name_all" => "Date of Birth (dd/mm/yyyy)"
            }),
  Field.new({"name" => "sex",
             "type" => "select_box",
             "option_strings_text_all" => "Male\nFemale",
             "display_name_all" => "Sex"
            }),
  Field.new({"name" => "registration_date",
             "type" => "date_field", "editable" => false,
             "display_name_all" => "Registration Date"
            }),
  Field.new({"name" => "status",
             "type" => "select_box",
             "option_strings_text_all" => "Open\nClosed",
             "display_name_all" => "Status"
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"basic_identity",
  "visible" => true,
  :order => 1,
  "editable" => true,
  :fields => basic_identity_fields,
  :perm_enabled => true,
  "name_all" => "Basic Identity",
  "description_all" => "Basic identity information about a separated or unaccompanied child."
})