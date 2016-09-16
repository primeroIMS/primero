ia_referral_fields = [
  Field.new({"name" => "to_user_remote",
             "type" => "text_field",
             "disabled" => true,
             "display_name_all" => "Remote User"
            }),
  Field.new({"name" => "to_user_agency",
             "type" => "text_field",
             "disabled" => true,
             "display_name_all" => "Remote User Agency"
            }),
  Field.new({"name" => "service",
             "type" => "text_field",
             "editable"=>false,
             "disabled" => true,
             "display_name_all" => "Service",
            }),
  Field.new({"name" => "notes",
             "type" => "textarea",
             "editable"=>false,
             "disabled" => true,
             "display_name_all" => "Notes",
            })
]

ia_external_referral = FormSection.create_or_update_form_section({
    :unique_id => "ia_external_referral",
    "visible" => false,
    "is_nested" => true,
    :parent_form => "case",
    "editable" => false,
    :fields => ia_referral_fields,
    :initial_subforms => 1,
    "name_all" => "IA External Referral",
    "description_all" => "IA External Referral"
})
