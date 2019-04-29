photo_audio_fields = [
    Field.new({"name" => "photos",
              "type" => "photo_upload_box",
              "editable" => false,
              "disabled" => true,
              "show_on_minify_form" => true,
              "display_name_en" => "Current Photo Key"
              }),
    Field.new({"name" => "recorded_audio",
              "type" => "audio_upload_box",
              "show_on_minify_form" => true,
              "editable" => false,
              "disabled" => true,
              "display_name_en" => "Recorded Audio"
              })
]

FormSection.create_or_update_form_section({
  unique_id: "photos_and_audio",
  parent_form: "case",
  visible: true,
  order_form_group: 140,
  order: 10,
  order_subform: 0,
  form_group_id: "photos_audio",
  fields: photo_audio_fields,
  editable: false,
  name_en: "Photos and Audio",
  description_en: "All Photo and Audio Files Associated with a Child Record",
  display_help_text_view: true,
  mobile_form: true
})
