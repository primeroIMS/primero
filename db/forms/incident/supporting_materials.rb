supporting_materials_fields = [
    Field.new({"name" => "upload_supporting_material",
              "type" => "document_upload_box",
              "editable" => false,
              "display_name_all" => "Supporting Materials",
              "upload_document_type" => "material",
              "upload_document_help_text" => {add: "E.g. photos, videos, scanned reports/written statements, satellite "\
                                                   "images, interview transcripts. Files should be no larger than 2 MB "\
                                                   "(executable (.exe) files cannot be uploaded)",
                                              comments: "E.g. violation which the uploaded file corroborates, specific "\
                                                        "aspect of the violation that the file documents, date on which "\
                                                        "the photo was taken or the interview/statement collected and by whom"
                                             }
             })
]

FormSection.create_or_update_form_section({
  :unique_id => "supporting_materials",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 100,
  :order => 11,
  :order_subform_ => 0,
  :fields => supporting_materials_fields,
  "editable" => false,
  "name_all" => "Supporting Materials",
  "description_all" => "Supporting Materials",
  "form_group_name" => "Supporting Materials",
  "display_help_text_view" => true
})