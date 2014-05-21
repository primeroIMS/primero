photo_audio_fields = [
    Field.new({"name" => "current_photo_key",
              "type" => "photo_upload_box", "editable" => false,
              "display_name_all" => "Current Photo Key"
              }),
    Field.new({"name" => "recorded_audio",
              "type" => "audio_upload_box", "editable" => false,
              "display_name_all" => "Recorded Audio"
              }),
]

FormSection.create_or_update_form_section({
  :unique_id => "photos_and_audio",
  "visible" => true,
  :order => 10,
  :fields => photo_audio_fields,
  :perm_visible => true,
  "editable" => false,
  "name_all" => "Photos and Audio",
  "description_all" => "All Photo and Audio Files Associated with a Child Record",
})