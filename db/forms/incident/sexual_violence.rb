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
             "option_strings_text_all" => ["Rape", "Enforced prostitution", "Enforced sterilization", "Forced pregnancy",
                                           "Forced abortion", "Mutilation", "Sexual harrassment/assault",
                                           "Sexual slavery and/or trafficking", "Sexual exploitation and/or abuse"].join("\n")
             }),
  Field.new({"name" => "associated_violation_status",
             "type" => "select_box",
             "display_name_all" => "Did the violation occur during or as a direct result of, or was related to, another violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  #NOTE: The following is a multi-select, but made it violation instead of violations so as not to conflict with reload violations JS
  Field.new({"name" => "associated_violation",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "If yes, please specify:",
             "option_strings_source" => "lookup ViolationType"
            }),
  Field.new({"name" => "sexual_violence_implications",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "What implications did the sexual violence have?",
             "option_strings_text_all" => ["Child(ren) born out of rape", "Complications from unsafe abortion",
                                           "Infanticide", "Death", "Injuries", "Disability/Physical impairment",
                                           "Acute/chronic illness", "Sexually transmitted diseases (e.g. HIV/AIDS)",
                                           "Mental health problems (e.g. depression, anxiety, post-traumatic stress disorder)",
                                           "Suicide", "Family rejection", "Social stigma/Community ostracism",
                                           "Investigation/prosecution/arrest", "School dropout"].join("\n"),
             "guiding_questions" => "This field is not compulsory.  The relevant information should not be actively "\
                                    "sought/pursued by the MRM monitors, and should only be recorded in the database if "\
                                    "spontaneously provided by the victim or otherwise available without interviewing the victim."
            }),
  Field.new({"name" => "sexual_violence_crossborder",
             "type" => "select_box",
             "display_name_all" => "Was this a cross-border violation?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
            }),
  Field.new({"name" => "additional_notes",
             "type" => "textarea",
             "display_name_all" => "Additional details"
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
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "sexual_violence_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "For guidance on the definition of rape and other grave sexual violence for MRM "\
                                    "purposes see MRM Field Manual, p. 6 and Annex 1: Glossary of Terms and Acronyms, "\
                                    "p. 64; Annex 2: International Legal Foundations and Standards, pp. 79-70; Annex 4: "\
                                    "Q & A Guidance on Security Council Resolution 1882, pp. 7-8."
            }),
  ##Subform##
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
