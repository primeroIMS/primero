require_relative './mrm_verification.rb' unless defined? MRM_VERIFICATION_FIELDS

#TODO - Subform fields have not yet been defined
military_use_subform_fields = [
  # Field.new({"name" => "site_number_attacked",
  #            "type" => "numeric_field",
  #            "display_name_all" => "Number of Sites Attacked",
  #            "visible" => false
  #           })
  # Followed by verification fields attached as MRM_VERIFICATION_FIELDS
]

#TODO - Subform fields have not yet been defined
# military_use_subform_section = FormSection.create_or_update_form_section({
#   "visible" => false,
#   "is_nested" => true,
#   :order_form_group => 40,
#   :order => 70,
#   :order_subform => 1,
#   :unique_id => "military_use",
#   :parent_form=>"incident",
#   "editable" => true,
#   :fields => (military_use_subform_fields + MRM_VERIFICATION_FIELDS),
#   "name_all" => "Nested Military use Subform",
#   "description_all" => "Nested Military use Subform",
#   :initial_subforms => 1,
#TODO: MAKE SURE THE COLLAPSED FIELD IS CORRECT!!!!
#TODO: Coordinate with self.violation_id_fields in the incident model
#TODO: Also update mrm_summary_page.rb
#   "collapsed_fields" => ["site_attack_type"]
# })

military_use_fields = [
  #The sole purpose of this field is to have Guiding Questions above the subforms
  Field.new({"name" => "military_use_guiding_questions",
             "type" => "select_box",
             "display_name_all" => "Definition",
             "disabled" => true,
             "option_strings_text_all" => ["Please read guidance text below for the violation definition.",
                                           "Other"].join("\n"),
             "selected_value" => "Please read guidance text below for the violation definition.",
             "guiding_questions" => "The military use of schools and hospitals is not a grave violation per se under "\
                                    "UN Security Council Resolution 1998. Therefore, reporting on military use of schools "\
                                    "and hospitals should be reported upon in detail, but separately. For further guidance "\
                                    "see 'Protect Schools+Hospitals - Guidance Note on Security Council Resolution 1998, 2014, "\
                                    "available at: https://childrenandarmedconflict.un.org/publications/AttacksonSchoolsHospitals.pdf "
            }),
  #TODO - Subform fields have not yet been defined
  # Field.new({"name" => "military_use",
  #            "type" => "subform", "editable" => true,
  #            "subform_section_id" => military_use_subform_section.unique_id,
  #            "display_name_all" => "Military use of schools and/or hospitals",
  #            "expose_unique_id" => true,
  #           })
]

FormSection.create_or_update_form_section({
  :unique_id => "military_use_violation_wrapper",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 70,
  :order_subform => 0,
  :form_group_keyed => true,
  :form_group_name => "Violations",
  "editable" => true,
  :fields => military_use_fields,
  "name_all" => "Military use of schools and/or hospitals",
  "description_all" => "Military use of schools and/or hospitals"
})
