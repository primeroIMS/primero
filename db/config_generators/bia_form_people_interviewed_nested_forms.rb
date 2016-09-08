people_interviewed_fields = [
  Field.new({"name" => "caregiver_interviewed",
             "type" => "text_field",
             "disabled" => true,
             "display_name_all" => "Person interviewed"
            }),
  Field.new({"name" => "caregiver_interviewed_said",
             "type" => "textarea",
             "disabled" => true,
             "display_name_all" => "What they said"
            }),
  Field.new({"name" => "caregiver_interviewed_date",
             "type" => "date_field",
             "display_name_all" => "Date this care / living arrangement started",
             "disabled" => true,
            }),
  Field.new({"name" => "caregiver2_interviewed",
             "type" => "text_field",
             "disabled" => true,
             "display_name_all" => "Person interviewed "
            }),
  Field.new({"name" => "caregiver2_interviewed_said",
             "type" => "textarea",
             "disabled" => true,
             "display_name_all" => "What they said "
            }),
  Field.new({"name" => "caregiver2_interviewed_date",
             "type" => "date_field",
             "display_name_all" => "Date this care / living arrangement started ",
             "disabled" => true,
            }),
  Field.new({"name" => "caregiver3_interviewed",
             "type" => "text_field",
             "disabled" => true,
             "display_name_all" => "Person interviewed  "
            }),
  Field.new({"name" => "caregiver3_interviewed_said",
             "type" => "textarea",
             "disabled" => true,
             "display_name_all" => "What they said  "
            }),
  Field.new({"name" => "caregiver3_interviewed_date",
             "type" => "date_field",
             "display_name_all" => "Date this care / living arrangement started  ",
             "disabled" => true,
            }),
  Field.new({"name" => "caregiver_general_recommendatations",
             "type" => "textarea",
             "disabled" => true,
             "display_name_all" => "General recommendations from the caregivers"
            })
]

interviews = FormSection.create_or_update_form_section({
    :unique_id => "bia_interviews_subform",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => people_interviewed_fields,
    :initial_subforms => 1,
    "name_all" => "Caregivers Interviewed",
    "description_all" => "Caregivers Interviewed"
})
