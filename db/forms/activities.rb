activities_fields = [
  Field.new({"name" => "activities_child_in_school_or_training",
             "type" => "select_box",
             "display_name_all" => "Is the Child in School or training?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "activities_school_name",
             "type" => "text_field",
             "display_name_all" => "Name of School"
            }),
  Field.new({"name" => "activities_reason_not_in_school",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If not, why not?",
             "option_strings_text_all" =>
                                  ["Child Labour",
                                   "Early Marriage", 
                                   "Financial Constraints",
                                   "Ignorance",
                                   "Lack of Infrastructure",
                                   "Lack of Access",
                                   "Lack of interest",
                                   "Pregnancy / Children",
                                   "Sent Abroad for Job",
                                   "Other"].join("\n")
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "activities",
  "visible" => true,
  :order => 18,
  "editable" => true,
  :fields => activities_fields,
  :perm_enabled => true,
  "name_all" => "Activities",
  "description_all" => "Activities"
})
