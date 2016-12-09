group_victims_section_fields_subform = [
  Field.new({"name" => "group_description",
             "type" => "text_field",
             "display_name_all" => "Description of the Group of Children"
            }),
  Field.new({"name" => "group_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violations",
             "option_strings_source" => "violations"
            }),
  Field.new({"name" => "group_number",
             "type" => "numeric_field",
             "display_name_all" => "How many children were involved?"
            }),
  Field.new({"name" => "group_gender",
             "type" => "select_box",
             "display_name_all" => "What was the sex of the group of children involved?",
             "option_strings_text_all" =>
                                    ["All Female",
                                     "All Male",
                                     "Mixed",
                                     "Unknown"].join("\n")
            }),
  Field.new({"name" => "group_age_band",
             "type" => "select_box",
             "display_name_all" => "Into which age band did the children fall?",
             "option_strings_text_all" =>
                                    ["<5years",
                                     "≥5<10 years",
                                     "≥10<15 years",
                                     "≥15<18 years",
                                     "Mixed",
                                     "Unknown"].join("\n")
            }),
  Field.new({"name" => "group_ethnicity",
             "type" => "select_box",
             "display_name_all" => "What were the ethnic affiliations of the children involved?",
             "option_strings_source" => "lookup group Ethnicity"
            }),
  Field.new({"name" => "group_nationality",
             "type" => "select_box",
             "display_name_all" => "What was the nationality of the children involved?",
             "option_strings_source" => "lookup group Nationality"
            }),
  Field.new({"name" => "group_religion",
             "type" => "select_box",
             "display_name_all" => "What was the religious affiliation of the children involved?",
             "option_strings_source" => "lookup group Religion"
            }),
  Field.new({"name" => "group_displacement_at_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "What was the status of the children involved at the time of the violation ?",
             "option_strings_text_all" =>
                                    ["Community Member",
                                     "IDP",
                                     "Refugee",
                                     "Returnee",
                                     "Mixed",
                                     "Unknown"].join("\n")
            })
]

group_victims_section = FormSection.create_or_update_form_section({
  "visible"=>false,
  "is_nested"=>true,
  :order_form_group => 60,
  :order => 10,
  :order_subform => 1,
  :unique_id=>"group_victims_section",
  :parent_form=>"incident",
  "editable"=>true,
  :fields => group_victims_section_fields_subform,
  "name_all" => "Nested Group Victims",
  "description_all" => "Group Victims Subform",
  "collapsed_fields" => ["group_gender", "group_age_band"],
  :initial_subforms => 1
})

group_victims_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "group_victims_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "Please enter here any information on group(s) of unidentified victims"
            }),
  ##Subform##
  Field.new({"name" => "group_victims_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => group_victims_section.unique_id,
             "display_name_all" => "Group Victims"
            }),
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "group_victims",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 60,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Group Victims",
  "editable" => true,
  :fields => group_victims_fields,
  "name_all" => "Group Victims",
  "description_all" => "Group Victims"
})
