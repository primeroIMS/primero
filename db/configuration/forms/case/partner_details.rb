partner_details_fields = [
  Field.new({"name" => "maritial_status",
             "type" =>"select_box" ,
             "display_name_en" => "Current Civil/Marital Status",
             "option_strings_source" => "lookup lookup-marital-status"
            }),
  Field.new({"name" => "partner_details",
             "type" => "text_field",
             "display_name_en" => "Partner/Spouse Details"
            }),
  Field.new({"name" => "relationship_length",
             "type" => "text_field",
             "display_name_en" => "Length of Marriage/Relationship"
            }),
  Field.new({"name" => "number_of_children",
             "type" => "numeric_field",
             "display_name_en" => "Number of Children"
            }),
  Field.new({"name" => "marital_status_during_separation",
             "type" => "select_box",
             "display_name_en" => "Marital Status During Separation",
             "option_strings_source" => "lookup lookup-marital-status-with-spouse"
            }),
  Field.new({"name" => "partner_details_during_separation",
             "type" => "text_field",
             "display_name_en" => "Partner/Spouse Details During Separation"
            }),
  Field.new({"name" => "relationship_length_during_separation",
             "type" => "text_field",
             "display_name_en" => "Length of Marriage/Relationship During Separation"
            }),
  Field.new({"name" => "number_of_children_during_separation",
             "type" => "numeric_field",
             "display_name_en" => "Number of Children During Separation"
            }),
  Field.new({"name" => "marital_status_pre_separation",
             "type" => "select_box",
             "display_name_en" => "Marital Status Prior to Separation",
             "option_strings_source" => "lookup lookup-marital-status-with-spouse"
            }),
  Field.new({"name" => "partner_details_pre_separation",
             "type" => "text_field",
             "display_name_en" => "Partner/Spouse Details Prior to Separation"
            }),
  Field.new({"name" => "relationship_length_pre_separation",
             "type" => "text_field",
             "display_name_en" => "Length of Marriage/Relationship Prior to Separation"
            }),
  Field.new({"name" => "number_of_children_pre_separation",
             "type" => "numeric_field",
             "display_name_en" => "Number of Children Prior to Separation"
            })
]

FormSection.create_or_update!({
  :unique_id => "partner_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 50,
  :order => 20,
  :order_subform => 0,
  :form_group_id => "family_partner_details",
  "editable" => true,
  :fields => partner_details_fields,
  "name_en" => "Partner/Spouse Details",
  "description_en" => "Partner/Spouse Details"
})
