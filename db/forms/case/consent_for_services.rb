# service_consent_fields = [
# 	Field.new({"name" => "consent_services_header",
#              "type" => "separator",
#              "display_name_all" => "Consent for Services"
#             }),
# 	Field.new({"name" => "consent_for_services",
#              "type" => "tick_box",
#              "tick_box_label_all" => "Yes",
#              "display_name_all" => "Did the survivor consent to share their information for any referrals?",
#              "help_text" => ""
#             })
# ]

# FormSection.create_or_update_form_section({
#   :unique_id=>"consent_for_services",
#   :parent_form=>"case",
#   "visible" => true,
#   :order_form_group => 20,
#   :order => 10,
#   :order_subform => 0,
#   :form_group_name => "Consent for Services",
#   "editable" => true,
#   :fields => service_consent_fields,
#   "name_all" => "Consent for Services",
#   "description_all" => "Consent for Services",
# })
