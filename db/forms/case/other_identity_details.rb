other_identity_details_fields = [
  # TODO should be configurable
  Field.new({"name" => "nationality",
             "type" =>"select_box" ,
             "multi_select" => true,
             "display_name_all" => "Nationality",
             "option_strings_text_all" => 
                          ["Nationality1",
                           "Nationality2",
                           "Nationality3"].join("\n")
            }),
  Field.new({"name" => "place_of_birth",
             "type" => "text_field",
             "display_name_all" => "Place of Birth"
            }),
        
  # TODO should be configurable
  Field.new({"name" => "country_of_birth",
             "type" =>"select_box" ,
             "display_name_all" => "Birth Country",
             "option_strings_text_all" => 
                          ["Country1",
                           "Country2",
                           "Country3",
                           "Country4"].join("\n")
            }),
            
  # TODO should be configurable
  Field.new({"name" => "country_of_origin",
             "type" =>"select_box" ,
             "display_name_all" => "Country of Origin",
             "option_strings_text_all" => 
                          ["Country1",
                           "Country2",
                           "Country3",
                           "Country4"].join("\n")
            }),
            
  Field.new({"name" => "address_last",
             "type" => "textarea",
             "display_name_all" => "Last Address"
            }),
  Field.new({"name" => "landmark_last",
             "type" => "text_field",
             "display_name_all" => "Last Landmark"
            }),
  #TODO location picker
  Field.new({"name" => "location_last",
             "type" =>"text_field" ,
             "display_name_all" => "Last Location"
            }),
  Field.new({"name" => "telephone_last",
             "type" => "text_field",
             "display_name_all" => "Last Telephone"
            }),
  Field.new({"name" => "ethnicity",
             "type" =>"select_box" ,
             "multi_select" => true,
             "display_name_all" => "Ethnicity/Clan/Tribe",
             "option_strings_text_all" => 
                          ["Ethnicity1",
                           "Ethnicity2",
                           "Ethnicity3"].join("\n")
            }),
  Field.new({"name" => "sub_ethnicity_1",
             "type" =>"select_box" ,
             "multi_select" => true,
             "display_name_all" => "Sub Ethnicity 1",
             "option_strings_text_all" => 
                          ["Sub-ethnicity1.1",
                           "Sub-ethnicity1.2",
                           "Sub-ethnicity1.3"].join("\n")
            }),
  Field.new({"name" => "sub_ethnicity_2",
             "type" =>"select_box" ,
             "multi_select" => true,
             "display_name_all" => "Sub Ethnicity 2",
             "option_strings_text_all" => 
                          ["Sub-ethnicity2.1",
                           "Sub-ethnicity2.2",
                           "Sub-ethnicity2.3"].join("\n")
            }),
   #TODO configurable by admin
   Field.new({"name" => "language",
             "type" =>"select_box" ,
             "multi_select" => true,
             "display_name_all" => "Language",
             "option_strings_text_all" => 
                          ["Language1",
                           "Language2",
                           "Language3"].join("\n")
            }),
  Field.new({"name" => "religion",
             "type" =>"select_box" ,
             "multi_select" => true,
             "display_name_all" => "Religion",
             "option_strings_text_all" => 
                          ["Religion1",
                           "Religion2",
                           "Religion3"].join("\n")
            })
]

FormSection.create_or_update_form_section({
  :unique_id=>"other_identity_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 30,
  :order_subform => 0,
  :form_group_name => "Identification / Registration",
  "editable" => true,
  :fields => other_identity_details_fields,
  :perm_enabled => true,
  "name_all" => "Other Identity Details",
  "description_all" => "Other Identity Details"
})
