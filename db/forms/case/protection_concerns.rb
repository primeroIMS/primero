protection_concern_fields = [
  Field.new({"name" => "protection_status",
             "type" => "select_box",
             "option_strings_source" => "lookup ProtectionStatus",
             "display_name_all" => "Protection Status"
            }),
  Field.new({"name" => "urgent_protection_concern",
             "type" => "radio_button",
             "display_name_all" => "Urgent Protection Concern?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "risk_level",
             "type" => "select_box",
             "display_name_all" => "Risk Level",
             "option_strings_source" => "lookup RiskLevel"
            }),
  Field.new({"name" => "system_generated_followup",
             "type" => "tick_box",
             "display_name_all" => "Generate follow up reminders?"
            }),
  Field.new({"name" => "displacement_status",
             "type" =>"select_box" ,
             "display_name_all" => "Displacement Status",
             "option_strings_source" => "lookup DisplacementStatus"
            }),
  Field.new({"name" => "unhcr_protection_code",
             "type" => "text_field",
             "display_name_all" => "UNHCR Protection Code"
            }),
  Field.new({"name" => "protection_concerns",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Protection Concerns",
             "option_strings_text_all" => [
                { id: 'sexuall_exploited', display_text: "Sexually Exploited" },
                { id: 'gbv_survivor', display_text: "GBV survivor" },
                { id: 'trafficked_smuggled', display_text: "Trafficked/smuggled" },
                { id: 'statelessness', display_text: "Statelessness" },
                { id: 'arreested_detained', display_text: "Arrested/Detained" },
                { id: 'migrant', display_text: "Migrant" },
                { id: 'disabled', display_text: "Disabled" },
                { id: 'serious_health_issue', display_text: "Serious health issue" },
                { id: 'refugee', display_text: "Refugee" },
                { id: 'caafag', display_text: "CAAFAG" },
                { id: 'street_child', display_text: "Street child" },
                { id: 'child_mother', display_text: "Child Mother" },
                { id: 'physically_or_mentally_abused', display_text: "Physically or Mentally Abused" },
                { id: 'living_with_vulnerable_person', display_text: "Living with vulnerable person" },
                { id: 'word_form_of_child_labor', display_text: "Word Forms of Child Labor" },
                { id: 'child_headed_household', display_text: "Child Headed Household" },
                { id: 'mentally_distressed', display_text: "Mentally Distressed" },
                { id: 'other', display_text: "Other" }
              ]
            }),
  Field.new({"name" => "protection_concerns_other",
    "type" => "text_field",
    "display_name_all" => "If Other, please specify"
  }),
  Field.new({"name" => "disability_type",
             "type" =>"select_box" ,
             "display_name_all" => "Disability Type",
             "option_strings_text_all" =>
                          ["Mental Disability",
                           "Physical Disability",
                           "Both"].join("\n")
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "protection_concern",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 20,
  :order_subform => 0,
  :form_group_name => "Identification / Registration",
  :fields => protection_concern_fields,
  "editable" => true,
  "name_all" => "Protection Concerns",
  "description_all" => "Protection concerns"
})