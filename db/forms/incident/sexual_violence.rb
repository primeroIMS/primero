require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

sexual_violence_subform_fields = [
  Field.new({"name" => "violation_tally",
       "type" => "tally_field",
       "display_name_all" => "Number of victims",
       "autosum_group" => "sexual_violence_number_of_survivors",
       "tally_all" => ['boys', 'girls', 'unknown'],
       "autosum_total" => true,
      }),
  Field.new({"name" => "sexual_violence_type",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Form(s) of sexual violence",
             "help_text_all" => "Select all that applies.",
             "option_strings_text_all" => [
                { id: 'rape', display_text: "Rape and/or other forms of sexual violence" },
                { id: 'sexual_assault', display_text: "Sexual harrassment/assault" },
                { id: 'forced_marriage', display_text:"Forced marriage" },
                { id: 'mutilation', display_text:"Mutilation" },
                { id: 'force_sterilization', display_text:"Forced sterilization" },
                { id: 'other', display_text:"Other" }
              ]
            }),
  Field.new({"name" => "displacement_at_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "Stage of displacement at time of incident",
             "visible" => false,
             "option_strings_text_all" =>
                                    ["Not Displaced/Home Country",
                                     "Pre-displacement",
                                     "During Flight",
                                     "During Refuge",
                                     "During Return/Transit",
                                     "Post-Displacement"].join("\n")
            }),
  Field.new({"name" => "abduction_status_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "Type of abduction at time of the incident",
             "visible" => false,
             "option_strings_text_all" =>
                                    ["None",
                                     "Forced Conscription",
                                     "Trafficked",
                                     "Other Abduction/Kidnapping"].join("\n")
            }),
  Field.new({"name" => "sexual_violence_other_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Was the rape or other grave sexual violence associated with other grave violations?",
             "help_text_all" => "Select all that applies.",
             "option_strings_text_all" => ["Killing",
                                           "Maiming",
                                           "Recruitment and/or use",
                                           "Abduction"].join("\n")
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional notes"
            })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
]

sexual_violence_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 1,
  :unique_id => "sexual_violence",
  :parent_form=>"incident",
  "editable" => true,
  :fields => (sexual_violence_subform_fields + MRM_VERIFICATION_FIELDS),
  "name_all" => "Nested Rape and/or other forms of sexual violence Subform",
  "description_all" => "Nested Rape and/or other forms of sexual violence Subform",
  :initial_subforms => 1,
  "collapsed_fields" => ["sexual_violence_type"]
})

sexual_violence_fields = [
  Field.new({"name" => "sexual_violence",
             "type" => "subform", "editable" => true,
             "subform_section_id" => sexual_violence_subform_section.unique_id,
             "display_name_all" => "Rape and/or other forms of sexual violence",
             "expose_unique_id" => true,
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "sexual_violence_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => sexual_violence_fields,
  "name_all" => "Rape and/or other forms of sexual violence",
  "description_all" => " Rape and/or other forms of sexual violence"
})
