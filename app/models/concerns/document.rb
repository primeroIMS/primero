class Document

  include Syncable::PrimeroEmbeddedModel
  include PrimeroModel

  property :file_name, String
  property :attachment_key, String
  property :document_description, String
  property :date, Date
  property :comments, String
  property :is_current, TrueClass

  validates_presence_of :file_name
end
