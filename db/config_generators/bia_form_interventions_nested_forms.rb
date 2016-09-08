interventions_fields = [
  Field.new({"name" => "intervention_service_to_be_provided",
             "type" => "text_field",
             "display_name_all" => "Briefly Describe Required Intervention",
             "disabled" => true
           }),
  Field.new({"name" => "intervention_service_type_to_be_provided",
             "type" => "select_box",
             "multi_select" => false,
             "disabled" => true,
             "display_name_all" => "Service Required",
             "option_strings_text_all" =>
                                  ["Emergency Medical Care",
                                   "General Medical Care",
                                   "Legal Assistance",
                                   "Protection Services (e.g. registration, shelters / safe haven)",
                                   "Education, Community Activities (e.g. CFS)",
                                   "MHPSS, Shelter / NFI",
                                   "Alternative Care",
                                   "Family Tracing",
                                   "Livelihoods / Cash",
                                   "Other"].join("\n")
            }),
  Field.new({"name" => "intervention_service_type_to_be_provided_other",
             "type" => "text_field",
             "display_name_all" => "If Other, please specify",
             "disabled" => true
            }),
  Field.new({"name" => "case_plan_provider_and_contact_details",
             "type" => "textarea",
             "display_name_all" => "Name of Organisation Referring To",
             "disabled" => true
            })
]

wishes = FormSection.create_or_update_form_section({
    :unique_id => "bia_interventions_subform",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => interventions_fields,
    :initial_subforms => 1,
    "name_all" => "List of Interventions and Services ",
    "description_all" => "List of Interventions and Services "
})
