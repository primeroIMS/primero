tracing_request_photo_audio_fields = [
    Field.new({"name" => "photos",
               "type" => "photo_upload_box",
               "editable" => false,
               "disabled" => true,
               "display_name_en" => "Current Photo Key",
               "show_on_minify_form" => true
              }),
    Field.new({"name" => "recorded_audio",
               "type" => "audio_upload_box",
               "editable" => false,
               "disabled" => true,
               "display_name_en" => "Recorded Audio",
               "show_on_minify_form" => true
              })
]

FormSection.create_or_update_form_section({
  unique_id: "tracing_request_photos_and_audio",
  parent_form: "tracing_request",
  visible: true,
  order_form_group: 40,
  order: 40,
  order_subform: 0,
  form_group_id: "photos_audio",
  fields: tracing_request_photo_audio_fields,
  editable: false,
  name_en: "Photos and Audio",
  display_help_text_view: true,
  mobile_form: true
})
