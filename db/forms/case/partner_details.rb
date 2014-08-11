partner_details_fields = [
  Field.new({"name" => "maritial_status",
             "type" =>"select_box" ,
             "display_name_all" => "Current Civil/Marital Status",
             "option_strings_text_all" => 
                          ["Single",
                           "Married/Cohabitating",
                           "Divorced/Separated",
                           "Widowed"].join("\n")
            }),
  Field.new({"name" => "partner_details",
             "type" => "text_field",
             "display_name_all" => "Partner's Details"
            }),
  Field.new({"name" => "relationship_length",
             "type" => "numeric_field",
             "display_name_all" => "Length of Marriage/Relationship"
            }),
  Field.new({"name" => "number_of_children",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children"
            }),
  Field.new({"name" => "marital_status_during_separation",
             "type" => "select_box",
             "display_name_all" => "Marital Status During Separation",
             "option_strings_text_all" => 
                          ["Married",
                           "Separated/Divorced",
                           "Single",
                           "Widowed",
                           "With Partner"].join("\n")
            }),
  Field.new({"name" => "partner_details_during_separation",
             "type" => "text_field",
             "display_name_all" => "Partner's Details During Separation"
            }),
  Field.new({"name" => "relationship_length_during_separation",
             "type" => "numeric_field",
             "display_name_all" => "Length of Marriage/Relationship During Separation"
            }),
  Field.new({"name" => "number_of_children_during_separation",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children During Separation"
            }),
  Field.new({"name" => "marital_status_pre_separation",
             "type" => "select_box",
             "display_name_all" => "Marital Status Prior to Separation",
             "option_strings_text_all" => 
                          ["Married",
                           "Separated/Divorced",
                           "Single",
                           "Widowed",
                           "With Partner"].join("\n")
            }),
  Field.new({"name" => "partner_details_pre_separation",
             "type" => "text_field",
             "display_name_all" => "Partner's Details Prior to Separation"
            }),
  Field.new({"name" => "relationship_length_pre_separation",
             "type" => "numeric_field",
             "display_name_all" => "Length of Marriage/Relationship Prior to Separation"
            }),
  Field.new({"name" => "number_of_children_pre_separation",
             "type" => "numeric_field",
             "display_name_all" => "Number of Children Prior to Separation"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "partner_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 50,
  :order => 20,
  :order_subform => 0,
  :form_group_name => "Family / Partner Details",
  "editable" => true,
  :fields => partner_details_fields,
  :perm_enabled => true,
  "name_all" => "Partner Details",
  "description_all" => "Partner Details"
})