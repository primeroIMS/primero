photo_audio_fields = [
    Field.new({"name" => "current_photo_key",
              "type" => "photo_upload_box", "editable" => false,
              "display_name_all" => "Current Photo Key"
              }),
    Field.new({"name" => "recorded_audio",
              "type" => "audio_upload_box", "editable" => false,
              "display_name_all" => "Recorded Audio"
              })
]

FormSection.create_or_update_form_section({
  :unique_id => "photos_and_audio",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 140,
  :order => 10,
  :order_subform_ => 0,
  :form_group_name => "Photos and Audio",
  :fields => photo_audio_fields,
  "editable" => false,
  "name_all" => "Photos and Audio",
  "description_all" => "All Photo and Audio Files Associated with a Child Record",
})