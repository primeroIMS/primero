#JIRA SL-327

case_plan_fields_subform = [
  Field.new({"name" => "relation_name",
             "type" => "text_field",
             "display_name_all" => "Name"
           }),
  Field.new({"name" => "relation",
             "type" => "select_box",
             "display_name_all" => "How are they related to the child?",
             "option_strings_text_all" =>
                                    ["Mother",
                                     "Father",
                                     "Aunt",
                                     "Uncle",
                                     "Grandmother",
                                     "Grandfather",
                                     "Brother",
                                     "Sister",
                                     "Husband",
                                     "Wife",
                                     "Partner",
                                     "Other Family",
                                     "Other Nonfamily"].join("\n")
            }),
  Field.new({"name" => "relation_is_caregiver",
             "type" => "tick_box",
             "display_name_all" => "Is this person the caregiver?",
             "tick_box_all" => "Yes"
            }),



  Field.new({"name" => "relation_sub_ethnicity1",
             "type" => "select_box",
             "display_name_all" => "Sub Ethnicity 1",
             "option_strings_source" => "lookup Ethnicity"
           }),
  Field.new({"name" => "relation_sub_ethnicity2",
             "type" => "select_box",
             "display_name_all" => "Sub Ethnicity 2",
             "option_strings_source" => "lookup Ethnicity"
           }),

]

case_plan_section = FormSection.create_or_update_form_section({
    "visible"=>false,
    "is_nested"=>true,
    :order_form_group => 999,
    :order => 999,
    :order_subform => 1,
    :unique_id=>"cp_case_plan_subform_case_plan_interventions",
    :parent_form=>"case",
    "editable"=>true,
    :fields => case_plan_fields_subform,
    :initial_subforms => 1,
    "name_all" => "List of Interventions and Services",
    "description_all" => "List of Interventions and Services",
    "collapsed_fields" => ["case_plan_timeframe"]
})

case_plan_fields_fields = [
  Field.new({"name" => "protection_concerns",
             "type" => "select_box",
             "display_name_all" => "Protection Concerns"
           }),
  Field.new({"name" => "case_plan_header",
             "type" => "separator",
             "display_name_all" => "Intervention Plans and Services to be Provided",
            }),
  ##Subform##
  Field.new({"name" => "family_details_section",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => case_plan_section.unique_id,
             "subform_sort_by" => "case_plan_timeframe",
             "display_name_all" => "Intervention plans and services details"
            }),
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "cp_case_plan",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 80,
  :order => 999,
  :order_subform => 0,
  :form_group_name => "Case Plan",
  "editable" => true,
  :fields => case_plan_fields,
  "name_all" => "Case Plan",
  "description_all" => "Case Plan"
})
