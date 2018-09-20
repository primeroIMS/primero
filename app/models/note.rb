class Note
  include CouchRest::Model::CastedModel
  include PrimeroModel

  #These property names map to the fields in the field_notes subform
  property :field_notes_subform_fields, String
  property :note_subject, String
  property :notes_date, Date
  property :note_created_by
end