protection_concern_fields = [
  Field.new({"name" => "protection_status",
             "type" => "select_box",
             "option_strings_source" => "lookup lookup-protection-status",
             "display_name_en" => "Protection Status"
            }),
  Field.new({"name" => "urgent_protection_concern",
             "type" => "radio_button",
             "display_name_en" => "Urgent Protection Concern?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "risk_level",
             "type" => "select_box",
             "display_name_en" => "Risk Level",
             "option_strings_source" => "lookup lookup-risk-level"
            }),
  Field.new({"name" => "displacement_status",
             "type" =>"select_box" ,
             "display_name_en" => "Displacement Status",
             "option_strings_source" => "lookup lookup-displacement-status"
            }),
  Field.new({"name" => "unhcr_protection_code",
             "type" => "text_field",
             "display_name_en" => "UNHCR Protection Code",
             "visible" => false,
             "editable" => false,
             "disabled" => true,
             "help_text_en" => "This field is deprecated in v1.2 and replaced by unchr_needs_code"
            }),
  Field.new({"name" => "protection_concerns",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_en" => "Protection Concerns",
             "required" => false,
             "option_strings_source" => "lookup lookup-protection-concerns"
            }),
  Field.new({"name" => "protection_concerns_other",
             "type" => "text_field",
             "display_name_en" => "If Other, please specify"
            }),
  Field.new({"name" => "unhcr_needs_codes",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_en" => "UNHCR Needs Codes",
             "option_strings_source" => "lookup lookup-unhcr-needs-codes"
            }),
  Field.new({"name" => "disability_type",
             "type" =>"select_box" ,
             "display_name_en" => "Disability Type",
             "option_strings_source" => "lookup lookup-disability-type"
            })
]

FormSection.create_or_update!({
  :unique_id => "protection_concern",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 30,
  :order => 20,
  :order_subform => 0,
  :form_group_id => "identification_registration",
  :fields => protection_concern_fields,
  "editable" => true,
  "name_en" => "Protection Concerns",
  "description_en" => "Protection concerns"
})
