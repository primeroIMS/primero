mother_name = [
  Field.new({"name" => "relation_name",
             "type" => "text_field",
             "display_name_all" => "Mother's Name",
             "disabled" => true
           }),
]
father_name = [
  Field.new({"name" => "relation_name",
             "type" => "text_field",
             "display_name_all" => "Father's Name",
             "disabled" => true
           })
]
caregiver_name = [
  Field.new({"name" => "relation_name",
             "type" => "text_field",
             "display_name_all" => "Primary Caregiver's Name (if applicable)",
             "disabled" => true
           })
]
nickname_ids = [ 
  Field.new({"name" => "relation_nickname",
             "type" => "text_field",
             "display_name_all" => "Nickname / Alias",
             "disabled" => true
           }),
  Field.new({"name" => "relation_unhcr_id_no",
             "type" => "text_field",
             "display_name_all" => "UN ID Number",
             "disabled" => true
           }),
  Field.new({"name" => "national_id_no_relation",
             "type" => "text_field",
             "display_name_all" => "National ID Number",
             "disabled" => true
           }),
  Field.new({"name" => "ration_card_no_relation",
             "display_name_all" => "Ration Card / Service ID Number",
             "type" => "text_field",
             "disabled" => true
           })
]
mother_citizenship_origin = [
  Field.new({"name" => "relation_nationality",
             "type" => "select_box",
             "display_name_all" => "Citizenship of the mother",
             "multi_select" => true,
             "disabled" => true,
             "option_strings_source" => "lookup Nationality"
           }),
  Field.new({"name" => "relation_nationality_other",
             "display_name_all" => "Other Citizenship",
             "type" => "text_field",
             "disabled" => true
           }),
  Field.new({"name" => "relation_country_of_origin",
             "display_name_all" => "Country of Origin",
             "type" => "select_box",
             "option_strings_source" => "lookup Country",
             "multi_select" => false,
             "disabled" => true
           })
]
father_citizenship_origin = [
  Field.new({"name" => "relation_nationality",
             "type" => "select_box",
             "display_name_all" => "Citizenship of the father",
             "multi_select" => true,
             "disabled" => true,
             "option_strings_source" => "lookup Nationality"
           }),
  Field.new({"name" => "relation_nationality_other",
             "display_name_all" => "Other Citizenship",
             "type" => "text_field",
             "disabled" => true
           }),
  Field.new({"name" => "relation_country_of_origin",
             "display_name_all" => "Country of Origin",
             "type" => "select_box",
             "option_strings_source" => "lookup Country",
             "multi_select" => false,
             "disabled" => true
           })
]

mother = FormSection.create_or_update_form_section({
    :unique_id => "bia_mother_family_details",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => mother_name + nickname_ids + mother_citizenship_origin,
    :initial_subforms => 1,
    "name_all" => "Mother",
    "description_all" => "Mother"
})

father = FormSection.create_or_update_form_section({
    :unique_id => "bia_father_family_details",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => father_name + nickname_ids + father_citizenship_origin,
    :initial_subforms => 1,
    "name_all" => "Father",
    "description_all" => "Father"
})

female_caregiver = FormSection.create_or_update_form_section({
    :unique_id => "bia_caregiver_family_details",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => caregiver_name + nickname_ids,
    :initial_subforms => 1,
    "name_all" => "Primary Caregiver",
    "description_all" => "Primary Caregiver"
})
