fields = [
  Field.new({"name" => "record_state",
        "type" => "tick_box",
        "display_name_all" => "Valid Record?"
        }),
  #TODO: id-enabled options need to be consolidated in lookups
  Field.new({"name" => "violation_category",
        "type" => "select_box",
        "display_name_all" => "Violation Category",
        "option_strings_text_all" => [
           { id: 'killing', display_text: "Killing of Children" },
           { id: 'maiming', display_text: "Maiming of Children" },
           { id: 'abduction', display_text: "Abduction" },
           { id: 'recruitment', display_text: "Recruitment and/or use of children" },
           { id: 'sexual_violence', display_text: "Rape and/or other forms of sexual violence" },
           { id: 'attack_on', display_text: "Attacks on schools and/or hospitals" },
           { id: 'military_use', display_text: "Military use of schools and/or hospitals" },
           { id: 'denial_humanitarian_access', display_text: "Denial of humanitarian access for children" },
           { id: 'other', display_text: "Other" }
        ],
        "help_text" => "When removing a violation category, please ensure that you have removed all Violation forms "\
                       "associated with the violation category. To do this, navigate to the Violations forms, find the "\
                       "specific violation type, and click the remove button on all sub-forms for the violation category."
        }),
  Field.new({"name" => "armed_force_group_names",
         "type" => "select_box",
         "multi_select" => true,
         "display_name_all" => "Armed Group Names",
         "option_strings_source" => "lookup ArmedForceGroupType"
        }),
]

FormSection.create_or_update_form_section({
  :unique_id=>"mrm_reportable_fields",
  :parent_form=>"incident",
  "visible" => false,
  :order => 1000,
  :order_form_group => 1000,
  "editable" => true,
  :fields => fields,
  "name_all" => "MRM Reportable Fields",
  "description_all" => "MRM Incident Reportable Fields"
})