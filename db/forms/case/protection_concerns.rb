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
             "option_strings_text_all" => ["High", "Medium", "Low"].join("\n")
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
             "option_strings_text_all" =>
                          ["Sexually Exploited",
                           "GBV survivor",
                           "Trafficked/smuggled",
                           "Statelessness",
                           "Arrested/Detained",
                           "Migrant",
                           "Disabled",
                           "Serious health issue",
                           "Refugee",
                           "CAAFAG",
                           "Street child",
                           "Child Mother",
                           "Physically or Mentally Abused",
                           "Living with vulnerable person",
                           "Word Forms of Child Labor",
                           "Child Headed Household",
                           "Mentally Distressed",
                           "Other"].join("\n")
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