class Document

  include Syncable::PrimeroEmbeddedModel
  include PrimeroModel

  property :file_name, String
  property :attachment_key, String
  property :document_type, String
  property :document_description, String

  #TODO: Add type validation
  TYPE_BIA = "bia" # Reachable as Document::TYPE_BIA
  TYPE_BID = "bid"
  TYPE_OTHER = "other"
end