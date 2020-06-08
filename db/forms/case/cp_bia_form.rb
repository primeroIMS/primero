bia_fields = [
    Field.new({"name" => "assessment_approved",
               "type" => "tick_box",
               "tick_box_label_en" => "Yes",
               "display_name_en" => "Approved by Manager",
               "disabled" => true,
               "editable" => false
              }),
    Field.new({"name" => "assessment_approved_date",
               "type" => "date_field",
               "display_name_en" => "Date",
               "disabled" => true,
               "editable" => false
              }),
    Field.new({"name" => "assessment_approved_comments",
               "type" => "textarea",
               "display_name_en" => "Manager Comments",
               "disabled" => true,
               "editable" => false
              }),
    Field.new({"name" => "approval_status_assessment",
               "type" => "select_box",
               "display_name_en" => "Approval Status",
               "option_strings_source" => "lookup lookup-approval-status",
               "disabled" => true,
               "editable" => false
              }),
    Field.new({"name" => "case_id_display",
               "type" => "text_field",
               "display_name_en" => "Primero Case ID",
               "disabled" => true,
               "editable" => false
              }),
    Field.new({"name" => "assessment_header",
               "type" => "separator",
               "display_name_en" => "ASSESSMENT FORM (for completion for all Child Protection cases including UASC)",
               "disabled" => true,
              }),
    Field.new({"name" => "case_priority",
               "type" => "select_box",
               "display_name_en" => "Priority",
               "disabled" => true,
               "option_strings_text_en" => [
                 { id: '2_days', display_text: "2 days" },
                 { id: '1_week', display_text: "1 week" },
                 { id: '30_days', display_text: "30 days" },
                 { id: 'non_urgent', display_text: "Non Urgent (enter date)" },
               ].map(&:with_indifferent_access)
              }),
    Field.new({"name" => "case_priority_date",
               "type" => "date_field",
               "display_name_en" => "Re-assessment date",
               "disabled" => true
              }),
    Field.new({"name" => "cpims_id",
               "type" => "text_field",
               "display_name_en" => "CPIMS No",
               "disabled" => true
              })
]

FormSection.create_or_update_form_section({
    :unique_id => "cp_bia_form",
    :parent_form=>"case",
    "visible" => true,
    :order_form_group => 136,
    :order => 10,
    :order_subform => 0,
    :form_group_id => "bia_form",
    "editable" => true,
    :fields => bia_fields,
    "name_en" => "BIA Form",
    "description_en" => "BIA Form"
})