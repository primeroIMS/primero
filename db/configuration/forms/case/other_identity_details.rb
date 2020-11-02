other_identity_details_fields = [
  Field.new({"name" => "nationality",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_en" => "Nationality",
             "option_strings_source" => "lookup lookup-country"
            }),
  Field.new({"name" => "place_of_birth",
             "type" => "text_field",
             "display_name_en" => "Place of Birth"
            }),
  Field.new({"name" => "country_of_birth",
             "type" =>"select_box",
             "display_name_en" => "Birth Country",
             "option_strings_source" => "lookup lookup-country"
            }),
  Field.new({"name" => "country_of_origin",
             "type" =>"select_box" ,
             "display_name_en" => "Country of Origin",
             "option_strings_source" => "lookup lookup-country"
            }),
  Field.new({"name" => "address_last",
             "type" => "textarea",
             "display_name_en" => "Last Address"
            }),
  Field.new({"name" => "landmark_last",
             "type" => "text_field",
             "display_name_en" => "Last Landmark"
            }),
  #TODO location picker
  Field.new({"name" => "location_last",
             "type" =>"select_box" ,
             "display_name_en" => "Last Location",
             "option_strings_source" => "Location",
             "matchable" => true
            }),
  Field.new({"name" => "telephone_last",
             "type" => "text_field",
             "display_name_en" => "Last Telephone",
             "matchable" => true
            }),
  Field.new({"name" => "ethnicity",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_en" => "Ethnicity/Clan/Tribe",
             "option_strings_source" => "lookup lookup-ethnicity",
             "matchable" => true
            }),
  Field.new({"name" => "sub_ethnicity_1",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_en" => "Sub Ethnicity 1",
             "option_strings_source" => "lookup lookup-ethnicity"
            }),
  Field.new({"name" => "sub_ethnicity_2",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_en" => "Sub Ethnicity 2",
             "option_strings_source" => "lookup lookup-ethnicity"
            }),
   #TODO configurable by admin
   Field.new({"name" => "language",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_en" => "Language",
             "option_strings_source" => "lookup lookup-language"
            }),
  Field.new({"name" => "religion",
             "type" =>"select_box",
             "multi_select" => true,
             "display_name_en" => "Religion",
             "option_strings_source" => "lookup lookup-religion"
            })
]

FormSection.create_or_update!({
  :unique_id=>"other_identity_details",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 30,
  :order_subform => 0,
  :form_group_id => "identification_registration",
  "editable" => true,
  :fields => other_identity_details_fields,
  "name_en" => "Other Identity Details",
  "description_en" => "Other Identity Details"
})
