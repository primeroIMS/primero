field_notes_subform_fields = [
  Field.new({"name" => "notes_date",
             "type" => "date_field",
             "display_name_en" => "Date"
            }),
  Field.new({"name" => "note_subject",
             "type" => "text_field",
             "display_name_en" => "Subject"
            }),
  Field.new({"name" => "field_notes_subform_fields",
             "type" => "textarea",
             "display_name_en" => "Notes"
            })
]

field_notes_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :mobile_form => true,
  :order_form_group => 110,
  :order => 20,
  :order_subform => 1,
  :unique_id => "notes_section",
  :parent_form=>"case",
  "editable" => true,
  :fields => field_notes_subform_fields,
  :initial_subforms => 1,
  "name_en" => "Nested Notes Subform",
  "description_en" => "Nested Notes Subform",
  "collapsed_fields" => ["note_subject"]
})

notes_fields = [
  Field.new({"name" => "notes_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => field_notes_subform_section.unique_id,
             "display_name_en" => "Notes",
             "subform_sort_by" => "notes_date"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "notes",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 1001,
  :order => 20,
  :order_subform => 0,
  :form_group_name => "Notes",
  "editable" => true,
  :fields => notes_fields,
  "name_en" => "Notes",
  "description_en" => "Notes",
  :mobile_form => true
})